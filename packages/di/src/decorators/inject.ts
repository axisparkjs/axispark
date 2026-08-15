import { Token } from '../token';
import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { InjectMetadata } from '../metadata';

export function Inject(token: Token): ParameterDecorator {
    return (target, _propertyKey, parameterIndex) => {
        const metadata: InjectMetadata = Metadata.get<InjectMetadata>(MetadataKeys.INJECT, target) ?? {
            target: Metadata.normalizeTarget(target),
            params: new Map()
        };
        metadata.target = Metadata.normalizeTarget(target);
        metadata.params.set(parameterIndex, token);
        Metadata.define(MetadataKeys.INJECT, metadata, target);
    };
}
