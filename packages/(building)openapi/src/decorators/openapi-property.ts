import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { OpenApiPropertyMetadata } from '../metadata/openapi-property-metadata';
import { extractTypeFromMetadata } from '../metadata/extract-property-type-from-metadata';

export function OpenApiProperty(metadata?: OpenApiPropertyMetadata): PropertyDecorator {
    return (target, propertyKey) => {
        const existingMetadata = Metadata.get<OpenApiPropertyMetadata[]>(MetadataKeys.OPENAPI_PROPERTY, target) || [];

        const metaType = extractTypeFromMetadata(target, propertyKey);
        const newMetadata: OpenApiPropertyMetadata = {
            name: propertyKey.toString(),
            type: metaType === 'array' ? 'string' : metaType,
            required: !metadata?.nullable && !metadata?.default,
            isArray: metaType === 'array',
            ...metadata
        };
        existingMetadata.push(newMetadata);

        Metadata.define(MetadataKeys.OPENAPI_PROPERTY, existingMetadata, target);
    };
}
