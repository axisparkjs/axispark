import { MetadataKeys } from '@axisparkjs/common/src';
import { Metadata } from '@axisparkjs/common/metadata/metadata';
import { ErrorClass } from '../errors';
import { CatchMetadata } from '../metadata/catch-metadata';

export function Catch(error: ErrorClass): MethodDecorator {
    return (target, propertyKey) => {
        const errorHandlers = Metadata.get<CatchMetadata[]>(MetadataKeys.CATCH, target.constructor) ?? [];

        errorHandlers.push({
            error,
            propertyKey
        });

        Metadata.define(MetadataKeys.CATCH, errorHandlers, target.constructor);
    };
}
