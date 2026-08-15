import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { InjectableTokenMetadata } from '../metadata';
import { InjectionToken } from '../token';

export function InjectableToken(injectionToken: InjectionToken): ClassDecorator {
    return (target) => {
        const metadata: InjectableTokenMetadata = {
            target: Metadata.normalizeTarget(target),
            injectionToken
        };

        Metadata.define(MetadataKeys.INJECTABLE_TOKEN, metadata, target);
    };
}
