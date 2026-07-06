import { Metadata, MetadataKeys, Injectable, Inject } from '@axisparkjs/common';
import { Resolver } from './resolver';
import { Container } from './container';
import { InjectionToken } from './token';
import { CircularDependencyError } from './errors/circular-dependency-error';

jest.mock('@axisparkjs/common', () => {
    const originalModule = jest.requireActual('@axisparkjs/common');
    return {
        ...originalModule,
        Metadata: {
            get: jest.fn()
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
    constructor(@Inject(token) public readonly dependency: Dependency, @Inject(token2) public readonly dependency2: Dependency) {}
}

describe('ConstructorResolver', () => {
    let resolver: Resolver;
    let container: { resolve: jest.Mock };
    let metadataMock: { get: jest.Mock };

    beforeAll(() => {
        metadataMock = Metadata as unknown as { get: jest.Mock };
    });

    beforeEach(() => {
        resolver = new Resolver();
        container = {
            resolve: jest.fn()
        };

        jest.clearAllMocks();
    });

    it('should create an instance without dependencies', () => {
        metadataMock.get.mockReturnValueOnce(undefined);

        const instance = resolver.resolve(ClassWithoutDependencies, container as unknown as Container);

        expect(instance).toBeInstanceOf(ClassWithoutDependencies);
        expect(container.resolve).not.toHaveBeenCalled();
    });

    it('should resolve constructor dependencies', () => {
        const dependency = new Dependency();
        container.resolve.mockReturnValue(dependency);
        metadataMock.get.mockImplementation((key) => {
            if (key === MetadataKeys.DESIGN_PARAM_TYPES) {
                return [Dependency];
            }
            if (key === MetadataKeys.INJECT) {
                return undefined;
            }
            return undefined;
        });

        const instance = resolver.resolve(ClassWithDependency, container as unknown as Container);

        expect(container.resolve).toHaveBeenCalledWith(Dependency);
        expect(instance.dependency).toBeInstanceOf(Dependency);
        expect(instance.dependency).toBe(dependency);
    });

    it('should use injection token when present', () => {
        const dependency = new Dependency();
        container.resolve.mockReturnValue(dependency);
        metadataMock.get.mockImplementation((key) => {
            if (key === MetadataKeys.DESIGN_PARAM_TYPES) {
                return [Dependency];
            }
            if (key === MetadataKeys.INJECT) {
                return new Map([[0, token]]);
            }
            return undefined;
        });

        const instance = resolver.resolve(ClassWithTokenDependency, container as unknown as Container);

        expect(container.resolve).toHaveBeenCalledWith(token);
        expect(instance.dependency).toBeInstanceOf(Dependency);
        expect(instance.dependency).toBe(dependency);
    });

    it('should use multiple injection tokens when present', () => {
        const dependency1 = new Dependency();
        const dependency2 = new Dependency();
        container.resolve.mockImplementation((type) => {
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

        const instance = resolver.resolve(ClassWithTokenDependencies, container as unknown as Container);

        expect(container.resolve).toHaveBeenCalledWith(token);
        expect(container.resolve).toHaveBeenCalledWith(token2);
        expect(instance.dependency).toBeInstanceOf(Dependency);
        expect(instance.dependency).toBe(dependency1);
        expect(instance.dependency2).toBeInstanceOf(Dependency);
        expect(instance.dependency2).toBe(dependency2);
    });

    it('should throw CircularDependencyError on circular dependency', () => {
        metadataMock.get = jest.fn().mockReturnValueOnce([ClassWithDependency]);
        container.resolve.mockImplementation((type) => {
            if (type === ClassWithDependency) {
                return resolver.resolve(ClassWithDependency, container as unknown as Container);
            }
            return new Dependency();
        });

        expect(() => resolver.resolve(ClassWithDependency, container as unknown as Container)).toThrow(CircularDependencyError);
    });
});
