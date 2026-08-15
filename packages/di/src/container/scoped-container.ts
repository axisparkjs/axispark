import { TokenUtils } from '../token';
import { ClassResolver } from './class-resolver';
import { Container } from './container';
import { ClassProvider, FactoryProvider } from '../types';

export class ScopedContainer {
    private readonly instances = new Map<string, any>();

    constructor(
        private readonly container: Container,
        private readonly resolver: ClassResolver
    ) {}

    async resolve<T>(provider: ClassProvider<T> | FactoryProvider<T>): Promise<T> {
        const instance = this.instances.get(TokenUtils.getName(provider.token));
        if (instance) return instance as T;

        const resolvedInstance = (await this.resolver.resolve(provider, this.container, this)) as T;

        this.instances.set(TokenUtils.getName(provider.token), resolvedInstance);
        return resolvedInstance;
    }
}
