import { Token } from '../token';
import { Metadata, MetadataKeys } from '@axisparkjs/common';

export function Inject(token: Token): ParameterDecorator {
    return (target, _propertyKey, parameterIndex) => {
        const metadata = Metadata.get<Map<number, Token>>(MetadataKeys.INJECT, target) ?? new Map();
        metadata.set(parameterIndex, token);
        Metadata.define(MetadataKeys.INJECT, metadata, target);
    };
}
