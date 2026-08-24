import { Metadata, MetadataKeys, Resolver, ClassType } from '@axisparkjs/common';
import { Container } from './container';
import { Token, TokenUtils } from '../token';
import { ClassProvider, FactoryProvider, InjectableScopes } from '../types';
import { ScopeDependencyError, CircularDependencyError } from '../errors';
import { ScopedContainer } from './scoped-container';
import { InjectMetadata } from '../metadata';

/**
 * ClassResolver is responsible for resolving class providers and factory providers. It handles the instantiation of classes, resolving their dependencies, and managing scopes. It also detects circular dependencies and scope violations during the resolution process.
 * @template T - The type of the instance being resolved.
 */
export class ClassResolver<T = unknown> implements Resolver<T> {
    private readonly resolving: { classType: ClassType; scope: InjectableScopes }[] = [];

    /**
     * Resolves a class provider or factory provider, instantiating the class and resolving its dependencies. It manages the resolution process, including handling scopes and detecting circular dependencies.
     * @param provider - The class provider or factory provider to resolve.
     * @param container - The container used for resolving dependencies.
     * @param scopedContainer - An optional scoped container for managing scoped instances.
     * @returns A promise that resolves to an instance of the class or the result of the factory function.
     * @throws {CircularDependencyError} If a circular dependency is detected during resolution.
     * @throws {ScopeDependencyError} If a scope violation is detected during resolution.
     */
    async resolve<T>(provider: ClassProvider<T> | FactoryProvider<T>, container: Container, scopedContainer?: ScopedContainer): Promise<T> {
        const { scope } = provider;
        let classType: ClassType<T>;
        if ('useClass' in provider) {
            classType = provider.useClass;
        } else {
            classType = provider.forClass;
        }

        if (this.resolving.some((t) => t.classType === classType)) {
            this.resolving.push({ classType, scope });
            throw new CircularDependencyError(this.resolving.map((t) => TokenUtils.getName(t.classType)).join(' -> '));
        }
        if ((scope === InjectableScopes.Scoped || scope === InjectableScopes.Transient) && this.resolving.some((t) => t.scope === InjectableScopes.Singleton)) {
            this.resolving.push({ classType, scope });
            throw new ScopeDependencyError(this.resolving.map((t) => TokenUtils.getName(t.classType) + ` (${t.scope})`).join(' -> '));
        }
        this.resolving.push({ classType, scope });

        try {
            let instance: T;
            if ('useClass' in provider) {
                const paramTypes: Token[] = Metadata.get(MetadataKeys.DESIGN_PARAM_TYPES, classType) ?? [];
                const metadata = Metadata.get<InjectMetadata>(MetadataKeys.INJECT, classType);
                const dependencies: unknown[] = [];
                for (const [index, paramType] of paramTypes.entries()) {
                    const token = metadata?.params.get(index);
                    dependencies.push(await container.resolve(token ?? paramType, scopedContainer));
                }
                instance = new classType(...dependencies);
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
