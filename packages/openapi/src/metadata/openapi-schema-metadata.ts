import { MetadataFromClass } from '@axisparkjs/common';
import { OpenApiObjectMetadata } from './openapi-object-metadata';

export type OpenApiSchemaMetadata = {
    name?: string;
} & MetadataFromClass &
    OpenApiObjectMetadata;
