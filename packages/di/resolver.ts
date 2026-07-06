import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { Constructor } from './constructor';
import { Container } from './container';
import { CircularDependencyError } from './errors/circular-dependency-error';
import { Token, TokenUtils } from './token';

export class Resolver {
    private readonly resolving: Token[] = [];

    resolve<T>(type: Constructor<T>, container: Container): T {
        if (this.resolving.includes(type)) {
            throw new CircularDependencyError(this.resolving.map((t) => TokenUtils.getName(t)).join(' -> '));
        }

        this.resolving.push(type);
        try {
            const paramTypes: Token[] = Metadata.get(MetadataKeys.DESIGN_PARAM_TYPES, type) || [];
            const metadata = Metadata.get<Map<number, Token>>(MetadataKeys.INJECT, type);
            const dependencies = paramTypes.map((paramType, index) => {
                const token = metadata?.get(index);
                return container.resolve(token ?? paramType);
            });
            const instance = new type(...dependencies);
            return instance;
        } finally {
            this.resolving.pop();
        }
    }
}
