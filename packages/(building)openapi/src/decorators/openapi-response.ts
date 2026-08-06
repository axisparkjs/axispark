import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { OpenApiResponseMetadata } from '../metadata/openapi-response-metadata';

export function OpenApiResponse(data: OpenApiResponseMetadata | OpenApiResponseMetadata['statusCode']): MethodDecorator {
    return (target, propertyKey) => {
        const openApiResponseMetadata = Metadata.get<OpenApiResponseMetadata[]>(MetadataKeys.OPENAPI_RESPONSE, target, propertyKey) ?? [];

        const metadata: OpenApiResponseMetadata = typeof data === 'number' || data === 'default' ? { statusCode: data } : data;
        openApiResponseMetadata.push(metadata);

        Metadata.define(MetadataKeys.OPENAPI_RESPONSE, openApiResponseMetadata, target, propertyKey);
    };
}

export const OpenApiDefaultResponse = (data: Omit<OpenApiResponseMetadata, 'statusCode'>) => OpenApiResponse({ ...data, statusCode: 'default' });
