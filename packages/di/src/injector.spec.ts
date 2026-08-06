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
});
