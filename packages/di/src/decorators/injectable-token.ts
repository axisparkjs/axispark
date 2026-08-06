import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { InjectionToken } from '../token';

export function InjectableToken(injectionToken: InjectionToken): ClassDecorator {
    return (target) => {
        Metadata.define(MetadataKeys.INJECTABLE_TOKEN, injectionToken, target);
    };
}
