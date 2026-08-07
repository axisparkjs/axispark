import { TokenUtils } from './token';
import { Resolver } from './resolver';
import { Container } from './container';
import { ClassProvider, FactoryProvider } from './types';

export class ScopedContainer {
    private readonly instances = new Map<string, any>();

    constructor(
        private readonly container: Container,
        private readonly resolver: Resolver
    ) {}

    async resolve<T>(provider: ClassProvider<T> | FactoryProvider<T>): Promise<T> {
        const instance = this.instances.get(TokenUtils.getName(provider.token));
        if (instance) return instance as T;

        const resolvedInstance = (await this.resolver.resolve(provider, this.container, this)) as T;

        this.instances.set(TokenUtils.getName(provider.token), resolvedInstance);
        return resolvedInstance;
    }
}
