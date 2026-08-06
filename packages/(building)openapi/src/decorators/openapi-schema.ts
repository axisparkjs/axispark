import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { OpenApiSchemaMetadata } from '../metadata/openapi-schema-metadata';

export function OpenApiSchema(metadata: OpenApiSchemaMetadata = {}): ClassDecorator {
    return (target) => {
        Metadata.define(MetadataKeys.OPENAPI_SCHEMA, metadata, target);
    };
}
