import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { Resolver } from './resolver';
import { ProviderNotFoundError, DecoratorNotIncludedError } from './errors';
import { ClassProvider, Provider, Constructor } from './types';
import { Token, TokenUtils } from './token';
import { Injectable } from './decorators';

export class Container {
    private readonly providers = new Map<Token, Provider>();
    private readonly resolver = new Resolver();

    bind<T>(provider: Provider<T> | Constructor<T>): void {
        if (!('token' in provider)) {
            provider = { token: provider, useClass: provider } as ClassProvider<T>;
        }

        if ('useClass' in provider && !Metadata.has(MetadataKeys.INJECTABLE, provider.useClass)) throw new DecoratorNotIncludedError(TokenUtils.getName(provider.useClass), Injectable.name);

        this.providers.set(provider.token, provider);
    }

    unbind<T>(token: Token<T>): void {
        this.providers.delete(token);
    }

    resolve<T>(token: Token<T>): T {
        const provider = this.providers.get(token);

        if (!provider) throw new ProviderNotFoundError(token);

        if ('useValue' in provider) return provider.useValue as T;

        if ('useExisting' in provider) return this.resolve(provider.useExisting) as T;

        let instance;
        if ('useFactory' in provider) {
            const deps = provider.inject?.map((token) => this.resolve(token)) || [];
            instance = provider.useFactory(...deps) as T;
        }

        if ('useClass' in provider) {
            instance = this.resolver.resolve(provider.useClass as Constructor<T>, this);
        }

        if (!instance) throw new Error(`Failed to resolve provider for token '${TokenUtils.getName(token)}'.`);

        this.bind({ token, useValue: instance });
        return instance;
    }
}
