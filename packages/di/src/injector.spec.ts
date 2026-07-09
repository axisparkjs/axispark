import { Injector } from './injector';
import { Container } from './container';
import { InjectionToken } from './token';

describe('Injector', () => {
    let container: jest.Mocked<Container>;
    let injector: Injector;

    beforeEach(() => {
        container = {
            resolve: jest.fn(),
            bind: jest.fn(),
            unbind: jest.fn()
        } as unknown as jest.Mocked<Container>;

        injector = new Injector(container);
    });

    describe('get', () => {
        it('should resolve the token using the container', () => {
            const token = new InjectionToken('token');
            const instance = { foo: 'bar' };

            container.resolve.mockReturnValue(instance);

            const result = injector.get(token);

            expect(container.resolve).toHaveBeenCalledTimes(1);
            expect(container.resolve).toHaveBeenCalledWith(token);
            expect(result).toBe(instance);
        });
    });

    describe('instantiate', () => {
        class TestClass {}

        it('should bind, resolve and unbind the constructor', () => {
            const instance = new TestClass();

            container.resolve.mockReturnValue(instance);

            const result = injector.instantiate(TestClass);

            expect(container.bind).toHaveBeenCalledTimes(1);
            expect(container.bind).toHaveBeenCalledWith(TestClass);

            expect(container.resolve).toHaveBeenCalledTimes(1);
            expect(container.resolve).toHaveBeenCalledWith(TestClass);

            expect(container.unbind).toHaveBeenCalledTimes(1);
            expect(container.unbind).toHaveBeenCalledWith(TestClass);

            expect(result).toBe(instance);
        });

        it('should call methods in the correct order', () => {
            class TestClass {}

            const calls: string[] = [];

            container.bind.mockImplementation(() => {
                calls.push('bind');
            });

            container.resolve.mockImplementation(() => {
                calls.push('resolve');
                return new TestClass();
            });

            container.unbind.mockImplementation(() => {
                calls.push('unbind');
            });

            injector.instantiate(TestClass);

            expect(calls).toEqual(['bind', 'resolve', 'unbind']);
        });
    });
});
