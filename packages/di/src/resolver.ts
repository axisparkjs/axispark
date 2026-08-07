import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { Constructor } from './types/constructor';
import { Container } from './container';
import { Token, TokenUtils } from './token';
import { ClassProvider, FactoryProvider, InjectableScope } from './types';
import { ScopeDependencyError, CircularDependencyError } from './errors';
import { ScopedContainer } from './scoped-container';

export class Resolver {
    private readonly resolving: { constructor: Constructor; scope: InjectableScope }[] = [];

    async resolve<T>(provider: ClassProvider<T> | FactoryProvider<T>, container: Container, scopedContainer?: ScopedContainer): Promise<T> {
        const { scope } = provider;
        let constructor: Constructor<T>;
        if ('useClass' in provider) {
            constructor = provider.useClass;
        } else {
            constructor = provider.forClass;
        }

        if (this.resolving.some((t) => t.constructor === constructor)) {
            this.resolving.push({ constructor, scope });
            throw new CircularDependencyError(this.resolving.map((t) => TokenUtils.getName(t.constructor)).join(' -> '));
        }
        if ((scope === InjectableScope.Scoped || scope === InjectableScope.Transient) && this.resolving.some((t) => t.scope === InjectableScope.Singleton)) {
            this.resolving.push({ constructor, scope });
            throw new ScopeDependencyError(this.resolving.map((t) => TokenUtils.getName(t.constructor) + ` (${t.scope})`).join(' -> '));
        }
        this.resolving.push({ constructor, scope });

        try {
            let instance: T;
            if ('useClass' in provider) {
                const paramTypes: Token[] = Metadata.get(MetadataKeys.DESIGN_PARAM_TYPES, constructor) ?? [];
                const metadata = Metadata.get<Map<number, Token>>(MetadataKeys.INJECT, constructor);
                const dependencies: unknown[] = [];
                for (const [index, paramType] of paramTypes.entries()) {
                    const token = metadata?.get(index);
                    dependencies.push(await container.resolve(token ?? paramType, scopedContainer));
                }
                instance = new constructor(...dependencies);
            } else {
                const dependencies: unknown[] = [];
                for (const token of provider.inject ?? []) {
                    dependencies.push(await container.resolve(token, scopedContainer));
                }
                instance = await provider.useFactory(...dependencies);
            }

            return instance;
        } finally {
            this.resolving.pop();
        }
    }
}
