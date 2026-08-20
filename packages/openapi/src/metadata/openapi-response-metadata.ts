import { MetadataFromMethod } from '@axisparkjs/common';
import { OpenApiObjectMetadata } from './openapi-object-metadata';

type OptionalType<T> = T extends { type: infer Type } ? Omit<T, 'type'> & { type?: Type } : T;

export type OpenApiResponseMetadata = OptionalType<OpenApiObjectMetadata> & {
    statusCode: number | 'default';
} & MetadataFromMethod;
