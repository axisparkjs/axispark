import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { InjectableTokenMetadata } from '../metadata';
import { InjectionToken } from '../token';

/**
 * A decorator that marks a class as having a specific injectable token.
 * @param injectionToken - The injection token to associate with the class.
 * @returns A class decorator.
 */
export function InjectableToken(injectionToken: InjectionToken): ClassDecorator {
    return (target) => {
        const metadata: InjectableTokenMetadata = {
            target: Metadata.normalizeTarget(target),
            injectionToken
        };

        Metadata.define(MetadataKeys.INJECTABLE_TOKEN, metadata, target);
    };
}
