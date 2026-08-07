import { Initializable, Metadata, MetadataKeys } from '@axisparkjs/common';
import { Resolver } from './resolver';
import { ProviderNotFoundError, DecoratorNotIncludedError, ScopedContainerNotProvidedError } from './errors';
import { ClassProvider, Provider, Constructor, InjectableScope, FactoryProvider } from './types';
import { InjectionToken, Token, TokenUtils } from './token';
import { ScopedContainer } from './scoped-container';
import { Injectable } from './decorators';
import { ClassRegistry } from './class-registry';
import { InjectableMetadata } from './metadata';

export class Container implements Initializable {
    private readonly providers = new Map<string, Provider>();
    private readonly resolver = new Resolver();

    init() {
        ClassRegistry.getWithMetadata(MetadataKeys.INJECTABLE).forEach((entry) => {
            const injectableMetadata = Metadata.get<InjectableMetadata>(MetadataKeys.INJECTABLE, entry) as InjectableMetadata;
            const injectionToken = Metadata.get<InjectionToken>(MetadataKeys.INJECTABLE_TOKEN, entry);
            if (injectionToken) this.bind({ token: injectionToken, useClass: entry, scope: injectableMetadata.scope });

            if (!this.providers.has(TokenUtils.getName(entry))) this.bind(entry);
        });
    }

    bind<T>(provider: Provider<T> | Constructor<T>): void {
        if (!('token' in provider)) {
            provider = { token: provider, useClass: provider, scope: InjectableScope.Singleton } as ClassProvider<T>;
        }

        if ('useClass' in provider && !Metadata.has(MetadataKeys.INJECTABLE, provider.useClass)) throw new DecoratorNotIncludedError(TokenUtils.getName(provider.useClass), Injectable.name);

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

        let instance: T | undefined;
        switch (provider.scope) {
            case InjectableScope.Singleton:
                instance = await this.resolveSingleton(provider);
                break;
            case InjectableScope.Scoped:
                if (!scopedContainer) throw new ScopedContainerNotProvidedError(token);
                instance = await scopedContainer.resolve(provider);
                break;
            case InjectableScope.Transient:
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
