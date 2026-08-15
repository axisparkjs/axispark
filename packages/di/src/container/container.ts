import { Initializable, Metadata, MetadataKeys, ClassType } from '@axisparkjs/common';
import { ClassResolver } from './class-resolver';
import { ProviderNotFoundError, DecoratorNotIncludedError, ScopedContainerNotProvidedError } from '../errors';
import { ClassProvider, Provider, InjectableScopes, FactoryProvider } from '../types';
import { Token, TokenUtils } from '../token';
import { ScopedContainer } from './scoped-container';
import { Injectable } from '../decorators';
import { ClassRegistry } from '../registry';
import { InjectableScopeMetadata, InjectableTokenMetadata } from '../metadata';

export class Container implements Initializable {
    private readonly providers = new Map<string, Provider>();
    private readonly resolver = new ClassResolver();

    init() {
        ClassRegistry.getWithMetadata(MetadataKeys.INJECTABLE).forEach((entry) => {
            const injectableTokenMetadata = Metadata.get<InjectableTokenMetadata>(MetadataKeys.INJECTABLE_TOKEN, entry);
            const injectableScopeMetadata = Metadata.get<InjectableScopeMetadata>(MetadataKeys.INJECTABLE_SCOPE, entry) ?? {
                target: entry,
                scope: InjectableScopes.Singleton
            };
            if (injectableTokenMetadata) this.bind({ token: injectableTokenMetadata.injectionToken, useClass: entry, scope: injectableScopeMetadata.scope });

            if (!this.providers.has(TokenUtils.getName(entry))) this.bind({ token: entry, useClass: entry, scope: injectableScopeMetadata.scope });
        });
    }

    bind<T>(provider: Provider<T> | ClassType<T>): void {
        if (!('token' in provider)) {
            provider = { token: provider, useClass: provider, scope: InjectableScopes.Singleton } as ClassProvider<T>;
        }

        if ('useClass' in provider && !Metadata.has(MetadataKeys.INJECTABLE, provider.useClass))
            throw new DecoratorNotIncludedError(TokenUtils.getName(provider.useClass), Injectable.name);

        this.providers.set(TokenUtils.getName(provider.token), provider);
    }

    unbind<T>(token: Token<T>): void {
        this.providers.delete(TokenUtils.getName(token));
    }

    createScopedContainer(): ScopedContainer {
        return new ScopedContainer(this, this.resolver);
    }

    async resolve<T>(token: Token<T>, scopedContainer?: ScopedContainer): Promise<T> {
        const provider = this.providers.get(TokenUtils.getName(token)) as Provider<T> | undefined;
        if (!provider) throw new ProviderNotFoundError(token);

        if ('useValue' in provider) return provider.useValue;
        if ('useExisting' in provider) return await this.resolve(provider.useExisting);

        let instance: T;
        switch (provider.scope) {
            case InjectableScopes.Singleton:
                instance = await this.resolveSingleton(provider);
                break;
            case InjectableScopes.Scoped:
                if (!scopedContainer) throw new ScopedContainerNotProvidedError(token);
                instance = await scopedContainer.resolve(provider);
                break;
            case InjectableScopes.Transient:
                instance = await this.resolveTransient(provider);
                break;
        }

        return instance;
    }

    private async resolveSingleton<T>(provider: ClassProvider<T> | FactoryProvider<T>, scopedContainer?: ScopedContainer): Promise<T> {
        const instance = await this.resolveInstance(provider, scopedContainer);
        this.bind({ token: provider.token, useValue: instance });
        return instance;
    }

    private async resolveTransient<T>(provider: ClassProvider<T> | FactoryProvider<T>, scopedContainer?: ScopedContainer): Promise<T> {
        return await this.resolveInstance(provider, scopedContainer);
    }

    private async resolveInstance<T>(provider: ClassProvider<T> | FactoryProvider<T>, scopedContainer?: ScopedContainer): Promise<T> {
        const instance = await this.resolver.resolve(provider, this, scopedContainer);
        return instance;
    }
}
