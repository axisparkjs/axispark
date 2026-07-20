import { Metadata } from '@axisparkjs/common';
import { Container } from './container';
import { Resolver } from './resolver';
import { InjectionToken } from './token';
import { ProviderNotFoundError, DecoratorNotIncludedError } from './errors';
import { Constructable } from './decorators/constructable';

jest.mock('@axisparkjs/common', () => {
    const originalModule = jest.requireActual('@axisparkjs/common');
    return {
        ...originalModule,
        Metadata: {
            has: jest.fn(),
            define: jest.fn()
        }
    };
});

describe('Container', () => {
    let container: Container;
    let metadataMock: { has: jest.Mock; define: jest.Mock };

    beforeAll(() => {
        metadataMock = Metadata as unknown as { has: jest.Mock; define: jest.Mock };
    });

    beforeEach(() => {
        container = new Container();
        jest.clearAllMocks();
    });

    @Constructable()
    class Service {}

    class Dependency {}

    it('should bind a constructor as a class provider', () => {
        metadataMock.has.mockReturnValue(true);

        expect(() => container.bind(Service)).not.toThrow();
    });

    it('should throw when binding a non constructable class', () => {
        metadataMock.has.mockReturnValue(false);

        expect(() => container.bind(Service)).toThrow(DecoratorNotIncludedError);
    });

    it('should bind a token', () => {
        const token = new InjectionToken('token');

        expect(() => container.bind({ token, useValue: 'value' })).not.toThrow();
    });

    it('should throw when binding a non constructable class with a token', () => {
        const token = new InjectionToken('token');
        metadataMock.has.mockReturnValue(false);

        expect(() => container.bind({ token, useClass: Service })).toThrow(DecoratorNotIncludedError);
    });

    it('should unbind a provider', () => {
        const token = new InjectionToken('token');

        container.bind({ token, useValue: 'value' });
        expect(() => container.unbind(token)).not.toThrow();
    });

    it('should throw when resolving an unbided class', () => {
        const token = new InjectionToken('token');

        expect(() => container.resolve(token)).toThrow(ProviderNotFoundError);
    });

    it('should resolve a value provider', () => {
        const token = new InjectionToken('value');

        container.bind({
            token,
            useValue: 123
        });

        expect(container.resolve(token)).toBe(123);
    });

    it('should resolve an existing provider', () => {
        const token1 = new InjectionToken('token1');
        const token2 = new InjectionToken('token2');

        container.bind({
            token: token1,
            useValue: 10
        });

        container.bind({
            token: token2,
            useExisting: token1
        });

        expect(container.resolve(token2)).toBe(10);
    });

    it('should resolve a factory provider', () => {
        const depToken = new InjectionToken('dep');
        const factoryToken = new InjectionToken('factory');

        const dependency = new Dependency();

        container.bind({
            token: depToken,
            useValue: dependency
        });

        container.bind({
            token: factoryToken,
            useFactory: (dep: Dependency) => dep.constructor.name,
            inject: [depToken]
        });

        expect(container.resolve(factoryToken)).toBe('Dependency');
    });

    it('should resolve a factory provider without dependencies', () => {
        const factoryToken = new InjectionToken('factory');

        container.bind({
            token: factoryToken,
            useFactory: () => 'no dependencies'
        });

        expect(container.resolve(factoryToken)).toBe('no dependencies');
    });

    it('should resolve a class provider', () => {
        metadataMock.has.mockReturnValue(true);

        const instance = new Service();

        jest.spyOn(Resolver.prototype, 'resolve').mockReturnValue(instance);

        container.bind(Service);

        expect(container.resolve(Service)).toBe(instance);
        expect(Resolver.prototype.resolve).toHaveBeenCalledWith(Service, container);
    });

    it('should cache resolved class instances', () => {
        metadataMock.has.mockReturnValue(true);

        const instance = new Service();

        const spy = jest.spyOn(Resolver.prototype, 'resolve').mockReturnValue(instance);

        container.bind(Service);

        expect(container.resolve(Service)).toBe(instance);
        expect(container.resolve(Service)).toBe(instance);

        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should throw ProviderNotFoundError when provider does not exist', () => {
        metadataMock.has.mockReturnValue(false);
        container = new Container();
        expect(() => container.resolve(Service)).toThrow(ProviderNotFoundError);
    });

    it('should throw when provider resolution returns undefined', () => {
        metadataMock.has.mockReturnValue(true);

        jest.spyOn(Resolver.prototype, 'resolve').mockReturnValue(undefined as never);

        container.bind(Service);

        expect(() => container.resolve(Service)).toThrow("Failed to resolve provider for token 'Service'.");
    });
});
