import { RouteGenerator } from './route-generator';
import { ClassRegistry, DecoratorNotIncludedError } from '@axisparkjs/di';
import { Metadata } from '@axisparkjs/common';
import { ExecutionTransport } from '@axisparkjs/engine';
import { HttpResultProcessor } from '../execution-results/http-result-processor';
import { HttpRequest, HttpResponse, HttpSession } from '../types';
import { HttpPluginOptions } from '../plugin/http-plugin-options';

jest.mock('@axisparkjs/di', () => ({
    ...jest.requireActual('@axisparkjs/di'),
    ClassRegistry: {
        getWithMetadata: jest.fn()
    }
}));

jest.mock('@axisparkjs/common', () => ({
    ...jest.requireActual('@axisparkjs/common'),
    Metadata: {
        define: jest.fn(),
        get: jest.fn()
    }
}));

describe('RouteGenerator', () => {
    class TestController {}

    let context: any;

    const options = {
        adapter: class TestAdapter {},
        port: 3000,
        logHttpRequests: true,
        logHttpResponses: true,
        logHttpErrors: true,
        logErrors: true,
        rootPath: '/api'
    } as unknown as HttpPluginOptions;

    beforeEach(() => {
        jest.clearAllMocks();

        context = {
            engine: {
                execute: jest.fn().mockResolvedValue(undefined)
            },
            container: {
                resolve: jest.fn(),
                bind: jest.fn(),
                unbind: jest.fn()
            }
        };
    });

    it('should generate routes with rootPath', () => {
        (ClassRegistry.getWithMetadata as jest.Mock).mockReturnValue([TestController]);

        (Metadata.get as jest.Mock)
            // Controller metadata
            .mockReturnValueOnce({
                prefix: '/users'
            })
            // Route metadata
            .mockReturnValueOnce([
                {
                    method: 'GET',
                    path: 'list',
                    propertyKey: 'list'
                }
            ]);

        const routes = RouteGenerator.generate(options, context);

        expect(routes).toHaveLength(1);
        expect(routes[0].controller).toBe(TestController);
        expect(routes[0].routes).toHaveLength(1);

        expect(routes[0].routes[0]).toMatchObject({
            method: 'GET',
            path: '/api/users/list',
            controller: TestController
        });

        expect(typeof routes[0].routes[0].handler).toBe('function');
    });

    it('should generate routes without rootPath', () => {
        options.rootPath = undefined;
        (ClassRegistry.getWithMetadata as jest.Mock).mockReturnValue([TestController]);

        (Metadata.get as jest.Mock)
            // Controller metadata
            .mockReturnValueOnce({
                prefix: '/users'
            })
            // Route metadata
            .mockReturnValueOnce([
                {
                    method: 'GET',
                    path: 'list',
                    propertyKey: 'list'
                }
            ]);

        const routes = RouteGenerator.generate(options, context);

        expect(routes).toHaveLength(1);
        expect(routes[0].controller).toBe(TestController);
        expect(routes[0].routes).toHaveLength(1);

        expect(routes[0].routes[0]).toMatchObject({
            method: 'GET',
            path: '/users/list',
            controller: TestController
        });

        expect(typeof routes[0].routes[0].handler).toBe('function');
    });

    it('should execute engine when handler is called', async () => {
        (ClassRegistry.getWithMetadata as jest.Mock).mockReturnValue([TestController]);

        (Metadata.get as jest.Mock)
            .mockReturnValueOnce({
                prefix: '/users'
            })
            .mockReturnValueOnce([
                {
                    method: 'GET',
                    path: 'list',
                    propertyKey: 'list'
                }
            ]);

        const routes = RouteGenerator.generate(options, context);

        await routes[0].routes[0].handler({
            request: {} as unknown as HttpRequest,
            response: {} as unknown as HttpResponse,
            session: {} as unknown as HttpSession
        });

        expect(context.engine.execute).toHaveBeenCalledWith(
            {
                request: {},
                response: {},
                session: {},
                transport: ExecutionTransport.Http
            },
            {
                target: TestController,
                method: 'list'
            },
            {
                container: context.container,
                processor: HttpResultProcessor
            }
        );
    });

    it('should throw if controller metadata does not exist', () => {
        (ClassRegistry.getWithMetadata as jest.Mock).mockReturnValue([TestController]);

        (Metadata.get as jest.Mock).mockReturnValueOnce(undefined);

        expect(() => RouteGenerator.generate(options, context)).toThrow(DecoratorNotIncludedError);
    });

    it('should return empty routes when controller has no route metadata', () => {
        (ClassRegistry.getWithMetadata as jest.Mock).mockReturnValue([TestController]);

        (Metadata.get as jest.Mock)
            .mockReturnValueOnce({
                prefix: '/users'
            })
            .mockReturnValueOnce(undefined);

        const routes = RouteGenerator.generate(options, context);

        expect(routes[0].routes).toEqual([]);
    });

    it.each([
        ['/api', 'users', '/test', '/test/api/users'],
        ['api', 'users', '/test', '/test/api/users'],
        ['/api/', '/users', undefined, '/api/users'],
        ['', 'users', '/test', '/test/users'],
        ['/', '', '/test', '/test'],
        ['', '', '', '/']
    ])('should join "%s" and "%s" with rootPath "%s" as "%s"', (prefix, path, rootPath, expected) => {
        options.rootPath = rootPath;
        (ClassRegistry.getWithMetadata as jest.Mock).mockReturnValue([TestController]);

        (Metadata.get as jest.Mock)
            .mockReturnValueOnce({
                prefix
            })
            .mockReturnValueOnce([
                {
                    method: 'GET',
                    path,
                    propertyKey: 'list'
                }
            ]);

        const routes = RouteGenerator.generate(options, context);

        expect(routes[0].routes[0].path).toBe(expected);
    });
});
