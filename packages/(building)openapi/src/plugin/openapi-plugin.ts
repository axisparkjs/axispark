import { AxiSparkContext, Plugin, Pluggable } from '@axisparkjs/core';
import { Logger } from '@axisparkjs/logger';
import { OpenApiPluginOptions } from './openapi-plugin-options';
import { OPENAPI_LOGGER, OPENAPI_OPTIONS } from '../di';
import { HttpPlugin } from '@axisparkjs/http';
import { HttpPluginOptions } from '@axisparkjs/http';
import { HTTP_OPTIONS } from '@axisparkjs/http';
import { PluginNotConfiguredError } from '@axisparkjs/core';
import { OpenApiDocument } from '../document/openapi-document';
import { OpenApiDocumentGenerator } from '../document/openapi-document-generator';
import { HttpAdapter } from '@axisparkjs/http';
import { HTTP_ADAPTER } from '@axisparkjs/http';
import { Route } from '@axisparkjs/http';
import { HttpMethod } from '@axisparkjs/http';
import { Constructor } from '@axisparkjs/di';
import { createConfig, lintFromString } from '@redocly/openapi-core';

@Plugin()
export class OpenApiPlugin extends Pluggable {
    static override readonly dependencies = [HttpPlugin];
    static readonly openApiJsonControllerName = 'OpenApi-Json';
    static readonly openApiYamlControllerName = 'OpenApi-Yaml';

    private logger!: Logger;
    protected options!: OpenApiPluginOptions;
    private httpOptions!: HttpPluginOptions;
    private httpAdapter!: HttpAdapter;
    private urls: { jsonUrl: string; yamlUrl: string };
    private document!: OpenApiDocument;
    private documentErrorsDetected!: string[];

    async onRegister(context: AxiSparkContext, options?: OpenApiPluginOptions): Promise<void> {
        if (!options) throw new PluginNotConfiguredError(OpenApiPlugin.name);
        this.logger = context.container.resolve(Logger).child('OpenApiPlugin');
        this.options = options;
        this.httpOptions = context.container.resolve(HTTP_OPTIONS);
        this.httpAdapter = context.container.resolve(HTTP_ADAPTER);

        this.registerContainerBindings(context);
        this.generateDocsUrl(this.httpOptions.basePath, this.options.docsUrl, this.options.yamlDocumentUrl, this.options.jsonDocumentUrl);
        this.configureRoutes();
        await this.generateAndValidateDocument();

        await this.logger.info(`Plugin registered`);
    }

    private async generateAndValidateDocument(): Promise<void> {
        this.document = OpenApiDocumentGenerator.generate(this.options, this.httpAdapter.getRegisteredRoutes());
        const config = await createConfig({
            extends: ['minimal']
        });
        const result = await lintFromString({
            source: this.document.toJson(),
            config
        });

        if (result.length > 0) {
            this.documentErrorsDetected = result.map((issue) => ` > ${issue.severity}: ${issue.message}`);
            await this.logger.debug(`Problems detected in OpenAPI document:\n${this.documentErrorsDetected.join('\n')}\n`);
        }
    }

    private registerContainerBindings(context: AxiSparkContext): void {
        context.container.bind({ token: OPENAPI_OPTIONS, useValue: this.options });
        context.container.bind({ token: OPENAPI_LOGGER, useValue: this.logger });
    }

    private generateDocsUrl(basePath = '', docsUrl = '', yamlDocumentUrl = 'openapi.yaml', jsonDocumentUrl = 'openapi.json'): void {
        basePath = this.options.globalPrefix && this.httpOptions.basePath ? this.httpOptions.basePath : '';
        basePath = basePath.startsWith('/') ? basePath : `/${basePath}`;
        docsUrl = docsUrl.startsWith('/') ? docsUrl : `/${docsUrl}`;
        yamlDocumentUrl = yamlDocumentUrl.startsWith('/') ? yamlDocumentUrl : `/${yamlDocumentUrl}`;
        jsonDocumentUrl = jsonDocumentUrl.startsWith('/') ? jsonDocumentUrl : `/${jsonDocumentUrl}`;

        const urls = {
            jsonUrl: `${basePath}${docsUrl}${jsonDocumentUrl}`.replace(/\/+/g, '/').replace(/\/$/, '') || '/',
            yamlUrl: `${basePath}${docsUrl}${yamlDocumentUrl}`.replace(/\/+/g, '/').replace(/\/$/, '') || '/'
        };
        this.urls = urls;
    }

    private configureRoutes(): void {
        const routes: Route[] = [];
        if (this.options.exposeJson)
            routes.push({
                controller: { name: OpenApiPlugin.openApiJsonControllerName } as unknown as Constructor,
                propertyKey: 'getOpenApiJson',
                path: this.urls.jsonUrl,
                method: HttpMethod.Get,
                handler: async (context) => {
                    context.response.json(this.document.toObject());
                }
            });

        if (this.options.exposeYaml)
            routes.push({
                controller: { name: OpenApiPlugin.openApiYamlControllerName } as unknown as Constructor,
                propertyKey: 'getOpenApiYaml',
                path: this.urls.yamlUrl,
                method: HttpMethod.Get,
                handler: async (context) => {
                    context.response.header('Content-Type', 'text/yaml').send(this.document.toYaml());
                }
            });

        this.httpAdapter.registerRoutes(routes);
    }

    async onStart(): Promise<void> {
        await this.logger.info(`Plugin started. OpenAPI documentation available`);
        await this.logger.info(`JSON: ${this.options.exposeJson ? this.urls.jsonUrl : 'Not exposed'}`);
        await this.logger.info(`YAML: ${this.options.exposeYaml ? this.urls.yamlUrl : 'Not exposed'}`);
    }

    async onStop(): Promise<void> {
        await this.logger.info(`Plugin stopped`);
    }
}
