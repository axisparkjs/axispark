import { RouteDefinition } from './route-definition';
import { HttpMethod } from '../types';
import { RouteHandler } from './route-handler';

describe('RouteDefinition', () => {
    class TestController {
        test() {}
    }

    const handler = jest.fn() as unknown as RouteHandler;

    it('should create a route definition with all provided values', () => {
        const route = new RouteDefinition(
            TestController,
            'test',
            HttpMethod.Get,
            '/users',
            handler
        );

        expect(route.target).toBe(TestController);
        expect(route.propertyKey).toBe('test');
        expect(route.httpMethod).toBe(HttpMethod.Get);
        expect(route.path).toBe('/users');
        expect(route.handler).toBe(handler);
    });

    it('should support symbol property keys', () => {
        const propertyKey = Symbol('test');

        const route = new RouteDefinition(
            TestController,
            propertyKey,
            HttpMethod.Post,
            '/users',
            handler
        );

        expect(route.target).toBe(TestController);
        expect(route.propertyKey).toBe(propertyKey);
        expect(route.httpMethod).toBe(HttpMethod.Post);
        expect(route.path).toBe('/users');
        expect(route.handler).toBe(handler);
    });

    it.each([
        HttpMethod.Delete,
        HttpMethod.Get,
        HttpMethod.Head,
        HttpMethod.Options,
        HttpMethod.Patch,
        HttpMethod.Post,
        HttpMethod.Put
    ])('should store the %s HTTP method', (httpMethod) => {
        const route = new RouteDefinition(
            TestController,
            'test',
            httpMethod,
            '/users',
            handler
        );

        expect(route.httpMethod).toBe(httpMethod);
    });

    it('should preserve the exact handler reference', () => {
        const routeHandler = jest.fn() as unknown as RouteHandler;

        const route = new RouteDefinition(
            TestController,
            'test',
            HttpMethod.Get,
            '/users',
            routeHandler
        );

        expect(route.handler).toBe(routeHandler);
    });

    it('should preserve the exact target reference', () => {
        const target = class AnotherController {};

        const route = new RouteDefinition(
            target,
            'test',
            HttpMethod.Get,
            '/users',
            handler
        );

        expect(route.target).toBe(target);
    });

    it('should preserve the exact path', () => {
        const path = '/users/:id';

        const route = new RouteDefinition(
            TestController,
            'test',
            HttpMethod.Get,
            path,
            handler
        );

        expect(route.path).toBe(path);
    });
});