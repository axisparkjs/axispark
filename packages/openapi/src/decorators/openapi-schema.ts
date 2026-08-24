import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { OpenApiSchemaMetadata } from '../metadata/openapi-schema-metadata';
import { DistributiveOmit } from '../types/distributive-omit';

/**
 * Decorator for adding OpenAPI schema metadata to classes.
 * @param metadata The metadata for the OpenAPI schema.
 * @returns A class decorator.
 */
export function OpenApiSchema(metadata?: DistributiveOmit<OpenApiSchemaMetadata, 'target' | 'type'>): ClassDecorator {
    return (target) => {
        const finalMetadata: OpenApiSchemaMetadata = {
            target: Metadata.normalizeTarget(target),
            type: target,
            ...(metadata as any)
        };
        Metadata.define(MetadataKeys.OPENAPI_SCHEMA, finalMetadata, target);
    };
}
