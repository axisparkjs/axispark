import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { TimeoutMetadata } from '../metadata';

/**
 * A decorator for defining a timeout for a method or class.
 * @param time The timeout duration in milliseconds.
 * @returns A timeout decorator.
 */
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

/**
 * A decorator for defining no timeout for a method or class.
 * @returns A no timeout decorator.
 */
export const NoTimeout = () => Timeout(-1);
