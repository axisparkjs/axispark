import { Metadata, MetadataKeys } from '@axisparkjs/common/src';
import { HttpStatus } from '../errors';

export function HttpCode(statusCode: HttpStatus): MethodDecorator {
    return (target, propertyKey) => {
        Metadata.defineMethod(MetadataKeys.HTTP_CODE, statusCode, target.constructor, propertyKey);
    };
}
