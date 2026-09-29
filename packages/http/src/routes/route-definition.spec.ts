import { RouteDefinition } from './route-definition';
import { HttpMethod } from '../types';
import { RouteHandler } from './route-handler';

describe('RouteDefinition', () => {
    class TestController {
        test() {}
    }

    const handler = jest.fn() as unknown as RouteHandler;

    describe('findRouteConflicts', () => {
        const route = (path: string, method = HttpMethod.Get, propertyKey = 'test') =>
            new RouteDefinition(TestController, propertyKey, method, path, undefined, handler);

        it('finds duplicate paths after normalizing parameters and slashes', () => {
            expect(
                route('/users/:id/')
                    .compare(route('/users/:slug'))
                    .map(({ type }) => type)
            ).toEqual(['duplicate']);
        });

        it('finds overlapping static and dynamic paths', () => {
            expect(
                route('/users/:id')
                    .compare(route('/users/me'))
                    .map(({ type }) => type)
            ).toEqual(['ambiguous']);
            expect(route('/users/me').compare(route('/users/:id')).map(({ type }) => type)).toEqual(['ambiguous']);
        });

        it('normalizes empty and root paths to the same route', () => {
            expect(route('').compare(route('/')).map(({ type }) => type)).toEqual(['duplicate']);
        });

        it('finds a specific route shadowed by an earlier wildcard', () => {
            expect(
                route('/users/*')
                    .compare(route('/users/me'))
                    .map(({ type }) => type)
            ).toEqual(['unreachable']);
        });

        it('ignores routes with different methods or unrelated paths', () => {
            expect(route('/users/:id').compare(route('/users/me', HttpMethod.Post))).toEqual([]);
            expect(route('/users/:id').compare(route('/teams/me'))).toEqual([]);
        });
    });

    it('should create a route definition with all provided values', () => {
        const route = new RouteDefinition(TestController, 'test', HttpMethod.Get, '/users', [], handler);

        expect(route.target).toBe(TestController);
        expect(route.propertyKey).toBe('test');
        expect(route.httpMethod).toBe(HttpMethod.Get);
        expect(route.path).toBe('/users');
        expect(route.versions).toEqual([]);
        expect(route.handler).toBe(handler);
    });

    it('should support symbol property keys', () => {
        const propertyKey = Symbol('test');

        const route = new RouteDefinition(TestController, propertyKey, HttpMethod.Post, '/users', undefined, handler);

        expect(route.target).toBe(TestController);
        expect(route.propertyKey).toBe(propertyKey);
        expect(route.httpMethod).toBe(HttpMethod.Post);
        expect(route.path).toBe('/users');
        expect(route.versions).toBeUndefined();
        expect(route.handler).toBe(handler);
    });

    it.each([HttpMethod.Delete, HttpMethod.Get, HttpMethod.Head, HttpMethod.Options, HttpMethod.Patch, HttpMethod.Post, HttpMethod.Put])(
        'should store the %s HTTP method',
        (httpMethod) => {
            const route = new RouteDefinition(TestController, 'test', httpMethod, '/users', [], handler);

            expect(route.httpMethod).toBe(httpMethod);
        }
    );

    it('should preserve the exact handler reference', () => {
        const routeHandler = jest.fn() as unknown as RouteHandler;

        const route = new RouteDefinition(TestController, 'test', HttpMethod.Get, '/users', [], routeHandler);

        expect(route.handler).toBe(routeHandler);
    });

    it('should preserve the exact target reference', () => {
        const target = class AnotherController {};

        const route = new RouteDefinition(target, 'test', HttpMethod.Get, '/users', [], handler);

        expect(route.target).toBe(target);
    });

    it('should preserve the exact path', () => {
        const path = '/users/:id';

        const route = new RouteDefinition(TestController, 'test', HttpMethod.Get, path, [], handler);

        expect(route.path).toBe(path);
    });
});
