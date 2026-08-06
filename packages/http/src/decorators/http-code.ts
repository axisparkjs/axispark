import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { HttpStatusCode } from '../types';

export function HttpCode(statusCode: HttpStatusCode): MethodDecorator {
    return (target, propertyKey) => {
        Metadata.define(MetadataKeys.HTTP_CODE, statusCode, target, propertyKey);
    };
}
