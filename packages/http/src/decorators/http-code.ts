import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { HttpStatusCode } from '../types';
import { HttpCodeMetadata } from '../metadata/http-code-metadata';

export function HttpCode(statusCode: HttpStatusCode): MethodDecorator {
    return (target, propertyKey) => {
        const metadata: HttpCodeMetadata = { 
            target: Metadata.normalizeTarget(target),
            propertyKey,
            statusCode
        };
        Metadata.define(MetadataKeys.HTTP_CODE, metadata, target, propertyKey);
    };
}
