import { Generator, Metadata, MetadataKeys } from '@axisparkjs/common';
import { OpenApiDocument } from './openapi-document';
import { OpenApiPluginOptions } from '../plugin/openapi-plugin-options';
import { Route } from '@axisparkjs/http';
import { OpenApiResponseMetadata } from '../metadata/openapi-response-metadata';
import { OpenApiPlugin } from '../plugin';
import { Constructor } from '@axisparkjs/di';
import { OpenApiSchemaMetadata } from '../metadata/openapi-schema-metadata';
import { OpenApiPropertyMetadata } from '../metadata/openapi-property-metadata';
import { ParameterMetadata } from '@axisparkjs/engine';
import { extractTypeFromMetadata } from '../metadata/extract-property-type-from-metadata';

class OpenApiDocumentGeneratorStatic implements Generator<OpenApiDocument> {
    private readonly schemasToGenerate = new Set<Constructor>();
    private readonly shcemasAlreadyGenerated = new Set<Constructor>();

    generate(options: OpenApiPluginOptions, routes: readonly Route[]): OpenApiDocument {
        const paths = this.generatePaths(routes);
        let schemas = {};
        do {
            const newSchemas = this.generateSchemas();
            schemas = { ...schemas, ...newSchemas };
        } while (this.schemasToGenerate.size > 0);

        const data = {
            openapi: '3.1.0',
            info: {
                title: options.info.title,
                version: options.info.version,
                description: options.info.description,
                termsOfService: options.info.termsOfService,
                contact: options.info.contact,
                license: options.info.license,
                summary: options.info.summary
            },
            externalDocs: options.info.externalDocs,
            tags: options.info.tags,
            servers: options.info.servers,
            webhooks: undefined,
            paths: paths,
            components: {
                schemas: schemas
            }
        };
        return new OpenApiDocument(data);
    }

    private generateSchemas(): any {
        const actualSchemasToGenerate = Array.from(this.schemasToGenerate).filter((schema) => !this.shcemasAlreadyGenerated.has(schema));
        this.schemasToGenerate.clear();
        actualSchemasToGenerate.forEach((schema) => this.shcemasAlreadyGenerated.add(schema));

        const result = Array.from(actualSchemasToGenerate).reduce((acc, schema) => {
            const openApiSchemaMetadata = Metadata.get<OpenApiSchemaMetadata>(MetadataKeys.OPENAPI_SCHEMA, schema);
            const openApiPropertyMetadata = Metadata.get<OpenApiPropertyMetadata[]>(MetadataKeys.OPENAPI_PROPERTY, schema) || [];
            const showExample = openApiSchemaMetadata?.example !== undefined;
            const requiredProperties = openApiPropertyMetadata.filter((property) => property.required).map((property) => property.name);

            acc[this.generateNameForSchema(schema)] = {
                type: 'object',
                description: openApiSchemaMetadata?.description,
                examples: showExample && openApiSchemaMetadata.example instanceof Array ? openApiSchemaMetadata.example : undefined,
                example: showExample && !(openApiSchemaMetadata.example instanceof Array) ? openApiSchemaMetadata.example : undefined,
                properties: this.generateProperties(openApiPropertyMetadata),
                required: requiredProperties.length > 0 ? requiredProperties : undefined
            };

            return acc;
        }, {} as any);

        return result;
    }

    private generateProperties(openApiPropertyMetadata: OpenApiPropertyMetadata[]): any {
        if (openApiPropertyMetadata.length === 0) return undefined;

        return openApiPropertyMetadata.reduce((acc, metadata) => {
            const { name, type, description, isArray, nullable, default: defaultValue, enum: enumValues, example, format, maxLength, maximum, minLength, minimum, pattern } = metadata;

            const isBasicType = type === 'boolean' || type === 'string' || type === 'number' || type === 'integer' || type === 'null';
            const primitiveType = isBasicType ? type : 'object';
            const dataIfTypeIsObject = type && !isBasicType ? { $ref: this.generateNameForSchema(type, true) } : {};
            if (type && !isBasicType) this.schemasToGenerate.add(type);
            const finalType = nullable ? [primitiveType, 'null'] : primitiveType;

            acc[name] = {
                ...(isArray
                    ? {
                          type: 'array',
                          items: { type: finalType, ...dataIfTypeIsObject }
                      }
                    : {
                          type: finalType,
                          ...dataIfTypeIsObject
                      }),
                description: description,
                default: defaultValue,
                enum: enumValues,
                example: example,
                format: format,
                maxLength: maxLength,
                maximum: maximum,
                minLength: minLength,
                minimum: minimum,
                pattern: pattern
            };
            return acc;
        }, {} as any);
    }

    private generatePaths(routes: readonly Route[]) {
        return routes.reduce((acc, route) => {
            const { path, method, controller, propertyKey } = route;
            const openApiPath = this.transformPathToOpenApiFormat(path);
            route.path = openApiPath;

            if (!acc[openApiPath]) acc[openApiPath] = {};
            const openApiResponseMetadata = Metadata.getMethod<OpenApiResponseMetadata[]>(MetadataKeys.OPENAPI_RESPONSE, controller, propertyKey) ?? [];

            acc[openApiPath][method] = {
                responses: this.generateResponses(route, openApiResponseMetadata),
                operationId: this.generateOperationId(controller.name, propertyKey),
                parameters: this.generateParameters(route),
                requestBody: this.generateRequestBody(route)
            };

            return acc;
        }, {} as any);
    }

    private generateParameters(route: Route) {
        const allowedParameterTypes = ['param', 'header', 'query', 'cookie'];
        let parameters = Metadata.getMethod<ParameterMetadata[]>(MetadataKeys.PARAMETER, route.controller, route.propertyKey) ?? [];
        parameters = parameters.filter((parameter) => allowedParameterTypes.includes(parameter.parameter));
        if (parameters.length === 0) return undefined;

        return parameters.map((parameter) => {
            const { parameter: parameterType, propertyKey, name, target, index } = parameter;
            const typeMeta = extractTypeFromMetadata(target, propertyKey, index);
            return {
                name: name || propertyKey.toString(),
                in: parameterType === 'param' ? 'path' : parameterType,
                schema: {
                    type: typeMeta === 'array' ? 'string' : typeMeta
                },
                required: parameterType === 'param' ? true : undefined
            };
        });
    }

    private generateRequestBody(route: Route) {
        const allowedParameterTypes = ['body'];
        let parameters = Metadata.getMethod<ParameterMetadata[]>(MetadataKeys.PARAMETER, route.controller, route.propertyKey) ?? [];
        parameters = parameters.filter((parameter) => allowedParameterTypes.includes(parameter.parameter));
        if (parameters.length === 0) return undefined;
        const param = parameters[0];

        const metaType = extractTypeFromMetadata(param.target, param.propertyKey, param.index);
        const isArray = metaType === 'array';

        const type = isArray ? 'string' : metaType;
        const isBasicType = type === 'boolean' || type === 'string' || type === 'number' || type === 'integer' || type === 'null';
        const primitiveType = isBasicType ? type : 'object';
        const dataIfTypeIsObject = !isBasicType ? { $ref: this.generateNameForSchema(type, true) } : {};
        if (!isBasicType) this.schemasToGenerate.add(type);
        const finalType = primitiveType;
        return {
            content: type
                ? {
                      'application/json': {
                          schema: isArray
                              ? {
                                    type: 'array',
                                    items: { type: finalType, ...dataIfTypeIsObject }
                                }
                              : {
                                    type: finalType,
                                    ...dataIfTypeIsObject
                                }
                      }
                  }
                : undefined
        };
    }

    private isSpecialCaseRoute(route: Route): boolean {
        return route.controller.name === OpenApiPlugin.openApiJsonControllerName || route.controller.name === OpenApiPlugin.openApiYamlControllerName;
    }

    private generateSpecialCaseResponse(route: Route) {
        const isYaml = route.controller.name === OpenApiPlugin.openApiYamlControllerName;
        const isJson = route.controller.name === OpenApiPlugin.openApiJsonControllerName;

        return {
            200: {
                description: isYaml ? 'Returns the OpenAPI document in YAML format' : 'Returns the OpenAPI document in JSON format',
                content: {
                    [isYaml ? 'text/yaml' : 'application/json']: {
                        schema: {
                            type: isJson ? 'object' : 'string'
                        }
                    }
                }
            }
        };
    }

    private generateResponses(route: Route, openApiResponseMetadata: OpenApiResponseMetadata[]) {
        if (this.isSpecialCaseRoute(route)) return this.generateSpecialCaseResponse(route);

        if (openApiResponseMetadata.length === 0) return undefined;

        return openApiResponseMetadata.reduce((acc, metadata) => {
            const { statusCode, type, description, isArray, nullable } = metadata;

            const isBasicType = type === 'boolean' || type === 'string' || type === 'number' || type === 'integer' || type === 'null';
            const primitiveType = isBasicType ? type : 'object';
            const dataIfTypeIsObject = type && !isBasicType ? { $ref: this.generateNameForSchema(type, true) } : {};
            if (type && !isBasicType) this.schemasToGenerate.add(type);
            const finalType = nullable ? [primitiveType, 'null'] : primitiveType;

            acc[statusCode] = {
                description: description || '',
                content: type
                    ? {
                          'application/json': {
                              schema: isArray
                                  ? {
                                        type: 'array',
                                        items: { type: finalType, ...dataIfTypeIsObject }
                                    }
                                  : {
                                        type: finalType,
                                        ...dataIfTypeIsObject
                                    }
                          }
                      }
                    : undefined
            };
            return acc;
        }, {} as any);
    }

    private transformPathToOpenApiFormat(path: string): string {
        return path.replace(/:([a-zA-Z0-9_]+)/g, '{$1}');
    }

    private generateOperationId(controllerName: string, propertyKey: string | symbol): string {
        return `${controllerName.toLocaleLowerCase().replace(/controller/i, '')}-${propertyKey.toString().toLocaleLowerCase()}`;
    }

    private generateNameForSchema(schema: Constructor, prefix = false): string {
        const openApiSchemaMetadata = Metadata.get<OpenApiSchemaMetadata>(MetadataKeys.OPENAPI_SCHEMA, schema) as OpenApiSchemaMetadata;
        const schemaName = openApiSchemaMetadata?.name || schema.name;
        if (prefix) return `#/components/schemas/${schemaName}`;
        else return schemaName;
    }
}

export const OpenApiDocumentGenerator = new OpenApiDocumentGeneratorStatic();
