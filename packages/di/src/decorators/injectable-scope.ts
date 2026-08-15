import { InjectableScopeMetadata } from '../metadata';
import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { InjectableScopes } from '../types';

export function InjectableScope(scope: InjectableScopes): ClassDecorator {
    return (target) => {
        const metadata: InjectableScopeMetadata = {
            target: Metadata.normalizeTarget(target),
            scope
        };

        Metadata.define(MetadataKeys.INJECTABLE_SCOPE, metadata, target);
    };
}
