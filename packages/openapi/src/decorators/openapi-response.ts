import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { OpenApiResponseMetadata } from '../metadata/openapi-response-metadata';
import { DistributiveOmit } from '../types/distributive-omit';

export function OpenApiResponse(
    metadata: DistributiveOmit<OpenApiResponseMetadata, 'target' | 'propertyKey'> | OpenApiResponseMetadata['statusCode']
): MethodDecorator {
    return (target, propertyKey) => {
        const openApiResponseMetadata = Metadata.get<OpenApiResponseMetadata[]>(MetadataKeys.OPENAPI_RESPONSE, target, propertyKey) ?? [];

        const finalMetadata: OpenApiResponseMetadata = {
            target: Metadata.normalizeTarget(target),
            propertyKey: propertyKey,
            ...((typeof metadata === 'number' || metadata === 'default' ? {} : metadata) as any),
            statusCode: typeof metadata === 'number' || metadata === 'default' ? metadata : metadata.statusCode
        };

        openApiResponseMetadata.push(finalMetadata);
        Metadata.define(MetadataKeys.OPENAPI_RESPONSE, openApiResponseMetadata, target, propertyKey);
    };
}

export const OpenApiDefaultResponse = (data: DistributiveOmit<OpenApiResponseMetadata, 'statusCode'>) => OpenApiResponse({ ...data, statusCode: 'default' });
