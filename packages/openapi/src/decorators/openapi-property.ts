import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { OpenApiPropertyMetadata } from '../metadata/openapi-property-metadata';
import { DistributiveOmit } from '../types/distributive-omit';
import { OpenApiDocumentGenerator } from '../document';

export function OpenApiProperty(metadata?: DistributiveOmit<OpenApiPropertyMetadata, 'target' | 'propertyKey'>): PropertyDecorator {
    return (target, propertyKey) => {
        const openApiPropertyMetadata = Metadata.get<OpenApiPropertyMetadata[]>(MetadataKeys.OPENAPI_PROPERTY, target) ?? [];

        const normalizedTarget = Metadata.normalizeTarget(target);
        const finalMetadata: OpenApiPropertyMetadata = {
            target: normalizedTarget,
            propertyKey: propertyKey,
            type: OpenApiDocumentGenerator.extractTypeFromMetadata(normalizedTarget, propertyKey),
            ...(metadata as any)
        };

        openApiPropertyMetadata.push(finalMetadata);
        Metadata.define(MetadataKeys.OPENAPI_PROPERTY, openApiPropertyMetadata, target);
    };
}
