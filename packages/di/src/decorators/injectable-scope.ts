import { InjectableScopeMetadata } from '../metadata';
import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { InjectableScopes } from '../types';

/**
 * A decorator that marks a class as having a specific injectable scope.
 * @param scope - The scope to associate with the class.
 * @returns A class decorator.
 */
export function InjectableScope(scope: InjectableScopes): ClassDecorator {
    return (target) => {
        const metadata: InjectableScopeMetadata = {
            target: Metadata.normalizeTarget(target),
            scope
        };

        Metadata.define(MetadataKeys.INJECTABLE_SCOPE, metadata, target);
    };
}
