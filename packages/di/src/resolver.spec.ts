import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { Resolver } from './resolver';
import { Container } from './container';
import { InjectionToken } from './token';
import { CircularDependencyError, ScopeDependencyError } from './errors';
import { Injectable, Inject } from './decorators';
import { InjectableScope } from './types';

jest.mock('@axisparkjs/common', () => {
    const originalModule = jest.requireActual('@axisparkjs/common');
    return {
        ...originalModule,
        Metadata: {
            get: jest.fn(),
            define: jest.fn()
        }
    };
});

@Injectable()
class Dependency {}

@Injectable()
class ClassWithoutDependencies {}

@Injectable()
class ClassWithDependency {
    constructor(public readonly dependency: Dependency) {}
}

const token = new InjectionToken('token');

@Injectable()
class ClassWithTokenDependency {
    constructor(@Inject(token) public readonly dependency: Dependency) {}
}

const token2 = new InjectionToken('token2');

@Injectable()
class ClassWithTokenDependencies {
    constructor(
        @Inject(token) public readonly dependency: Dependency,
        @Inject(token2) public readonly dependency2: Dependency
    ) {}
}

describe('Resolver', () => {
    let resolver: Resolver;
    let container: { resolve: jest.Mock };
    let metadataMock: { get: jest.Mock };

    beforeAll(() => {
        metadataMock = Metadata as unknown as {
            get: jest.Mock;
        };
    });

    beforeEach(() => {
        resolver = new Resolver();

        container = {
            resolve: jest.fn()
        };

        jest.clearAllMocks();
    });

    it('should create an instance without dependencies', async () => {
        metadataMock.get.mockReturnValue(undefined);

        const instance = await resolver.resolve(
            {
                token: ClassWithoutDependencies,
                useClass: ClassWithoutDependencies,
                scope: InjectableScope.Singleton
            },
            container as unknown as Container
        );

        expect(instance).toBeInstanceOf(ClassWithoutDependencies);
        expect(container.resolve).not.toHaveBeenCalled();
    });

    it('should resolve constructor dependencies', async () => {
        const dependency = new Dependency();

        container.resolve.mockResolvedValue(dependency);

        metadataMock.get.mockImplementation((key) => {
            if (key === MetadataKeys.DESIGN_PARAM_TYPES) {
                return [Dependency];
            }

            if (key === MetadataKeys.INJECT) {
                return undefined;
            }

            return undefined;
        });

        const instance = await resolver.resolve(
            {
                token: ClassWithDependency,
                useClass: ClassWithDependency,
                scope: InjectableScope.Singleton
            },
            container as unknown as Container
        );

        expect(container.resolve).toHaveBeenCalledWith(Dependency, undefined);
        expect(instance.dependency).toBe(dependency);
    });

    it('should use injection token when present', async () => {
        const dependency = new Dependency();

        container.resolve.mockResolvedValue(dependency);

        metadataMock.get.mockImplementation((key) => {
            if (key === MetadataKeys.DESIGN_PARAM_TYPES) {
                return [Dependency];
            }

            if (key === MetadataKeys.INJECT) {
                return new Map([[0, token]]);
            }

            return undefined;
        });

        const instance = await resolver.resolve(
            {
                token: ClassWithTokenDependency,
                useClass: ClassWithTokenDependency,
                scope: InjectableScope.Singleton
            },
            container as unknown as Container
        );

        expect(container.resolve).toHaveBeenCalledWith(token, undefined);
        expect(instance.dependency).toBe(dependency);
    });

    it('should use multiple injection tokens when present', async () => {
        const dependency1 = new Dependency();
        const dependency2 = new Dependency();

        container.resolve.mockImplementation(async (type) => {
            if (type === token) {
                return dependency1;
            }

            if (type === token2) {
                return dependency2;
            }

            return undefined;
        });

        metadataMock.get.mockImplementation((key) => {
            if (key === MetadataKeys.DESIGN_PARAM_TYPES) {
                return [Dependency, Dependency];
            }

            if (key === MetadataKeys.INJECT) {
                return new Map([
                    [0, token],
                    [1, token2]
                ]);
            }

            return undefined;
        });

        const instance = await resolver.resolve(
            {
                token: ClassWithTokenDependencies,
                useClass: ClassWithTokenDependencies,
                scope: InjectableScope.Singleton
            },
            container as unknown as Container
        );

        expect(container.resolve).toHaveBeenNthCalledWith(1, token, undefined);

        expect(container.resolve).toHaveBeenNthCalledWith(2, token2, undefined);

        expect(instance.dependency).toBe(dependency1);
        expect(instance.dependency2).toBe(dependency2);
    });

    it('should resolve a factory provider', async () => {
        container.resolve.mockResolvedValue('dependency');

        const instance = await resolver.resolve(
            {
                token: token,
                inject: [token2],
                useFactory: async (value: string) => value + '-factory',
                scope: InjectableScope.Singleton,
                forClass: String
            },
            container as unknown as Container
        );

        expect(container.resolve).toHaveBeenCalledWith(token2, undefined);

        expect(instance).toBe('dependency-factory');
    });

    it('should resolve a factory provider without dependencies', async () => {
        const instance = await resolver.resolve(
            {
                token,
                useFactory: async () => 'factory',
                scope: InjectableScope.Singleton,
                forClass: String
            },
            container as unknown as Container
        );

        expect(container.resolve).not.toHaveBeenCalled();
        expect(instance).toBe('factory');
    });

    it('should throw CircularDependencyError on circular dependency', async () => {
        metadataMock.get = jest.fn().mockReturnValueOnce([ClassWithDependency]);

        container.resolve.mockImplementation((type) => {
            if (type === ClassWithDependency) {
                return resolver.resolve(
                    {
                        token: ClassWithDependency,
                        useClass: ClassWithDependency,
                        scope: InjectableScope.Singleton
                    },
                    container as unknown as Container
                );
            }

            return Promise.resolve(new Dependency());
        });

        await expect(
            resolver.resolve(
                {
                    token: ClassWithDependency,
                    useClass: ClassWithDependency,
                    scope: InjectableScope.Singleton
                },
                container as unknown as Container
            )
        ).rejects.toThrow(CircularDependencyError);
    });

    it('should throw ScopeDependencyError when singleton depends on scoped service', async () => {
        metadataMock.get = jest.fn().mockReturnValueOnce([Dependency]);

        container.resolve.mockImplementation((type) => {
            if (type === Dependency) {
                return resolver.resolve(
                    {
                        token: Dependency,
                        useClass: Dependency,
                        scope: InjectableScope.Scoped
                    },
                    container as unknown as Container
                );
            }

            return Promise.resolve(undefined);
        });

        await expect(
            resolver.resolve(
                {
                    token: ClassWithDependency,
                    useClass: ClassWithDependency,
                    scope: InjectableScope.Singleton
                },
                container as unknown as Container
            )
        ).rejects.toThrow(ScopeDependencyError);
    });
});
