import { Metadata, MetadataKeys } from '@axisparkjs/common';

export function Timeout(timeout: number): MethodDecorator & ClassDecorator {
    return function (target: any, propertyKey?: string | symbol) {
        if (propertyKey) {
            // Method decorator
            Metadata.define(MetadataKeys.EXECUTION_TIMEOUT, timeout, target, propertyKey);
        } else {
            // Class decorator
            Metadata.define(MetadataKeys.EXECUTION_TIMEOUT, timeout, target);
        }
    };
}

export const NoTimeout = () => Timeout(-1);