import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { TimeoutMetadata } from '../metadata';

export function Timeout(time: number): MethodDecorator & ClassDecorator {
    return function (target: any, propertyKey?: string | symbol) {
        const metadata: TimeoutMetadata = {
            target: Metadata.normalizeTarget(target),
            propertyKey,
            time
        };
        if (propertyKey) {
            // Method decorator
            Metadata.define(MetadataKeys.TIMEOUT, metadata, target, propertyKey);
        } else {
            // Class decorator
            Metadata.define(MetadataKeys.TIMEOUT, metadata, target);
        }
    };
}

export const NoTimeout = () => Timeout(-1);
