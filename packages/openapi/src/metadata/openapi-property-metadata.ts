import { MetadataFromProperty } from '@axisparkjs/common';
import { OpenApiObjectMetadata } from './openapi-object-metadata';

export type OpenApiPropertyMetadata = {
    name?: string;
} & MetadataFromProperty &
    OpenApiObjectMetadata;
