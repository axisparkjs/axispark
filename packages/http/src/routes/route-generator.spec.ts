import { ClassRegistry } from '@axisparkjs/di';
import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { ExecutionTransport } from '@axisparkjs/engine';

import { RouteGenerator } from './route-generator';
import { RouteDefinition } from './route-definition';

import { HttpEngine } from '../engine/http-engine';
import { ScopedContainerManager } from '@axisparkjs/di';
import { HttpPluginOptions } from '../plugin/http-plugin-options';
import { HttpMethod } from '../types';
import { VersionType } from '../version';

jest.mock('@axisparkjs/di', () => ({
    ...jest.requireActual('@axisparkjs/di'),
    ClassRegistry: {
        getWithMetadata: jest.fn()
    }
}));

jest.mock('@axisparkjs/common', () => ({
    ...jest.requireActual('@axisparkjs/common'),
    Metadata: {
        ...jest.requireActual('@axisparkjs/common').Metadata,
        get: jest.fn(),
        normalizeTarget: jest.fn((target) => target),
        define: jest.fn()
    }
}));

describe('RouteGenerator', () => {
    class TestController {
        list() {}

        create() {}

        update() {}
    }

    let generator: RouteGenerator;
    let httpEngine: {
        execute: jest.Mock;
    };
    let scopedContainerManager: {
        create: jest.Mock;
    };
    let options: HttpPluginOptions;

    beforeEach(() => {
        jest.clearAllMocks();

        httpEngine = {
            execute: jest.fn().mockResolvedValue(undefined)
        };

        scopedContainerManager = {
            create: jest.fn().mockReturnValue('scoped-container')
        };

        options = {
            adapter: class TestAdapter {},
            port: 3000,
            basePath: '/api'
        } as HttpPluginOptions;

        generator = new RouteGenerator(httpEngine as unknown as HttpEngine, scopedContainerManager as unknown as ScopedContainerManager, options);
    });

    describe('generate', () => {
        it('should return an empty array when there are no controllers', async () => {
            (ClassRegistry.getWithMetadata as jest.Mock).mockReturnValue([]);

            const routes = await generator.generate();

            expect(routes).toEqual([]);
            expect(Metadata.get).not.toHaveBeenCalled();
        });

        it('should generate a route definition', async () => {
            (ClassRegistry.getWithMetadata as jest.Mock).mockReturnValue([TestController]);

            (Metadata.get as jest.Mock)
                .mockReturnValueOnce({
                    target: TestController,
                    prefix: '/users'
                })
                .mockReturnValueOnce([
                    {
                        target: TestController,
                        propertyKey: 'list',
                        method: HttpMethod.Get,
                        path: '/list'
                    }
                ]);

            const routes = await generator.generate();

            expect(routes).toHaveLength(1);
            expect(routes[0]).toBeInstanceOf(RouteDefinition);

            expect(routes[0]).toMatchObject({
                target: TestController,
                propertyKey: 'list',
                httpMethod: HttpMethod.Get,
                path: '/api/users/list'
            });

            expect(typeof routes[0].handler).toBe('function');
        });

        it('should get controllers using controller metadata', async () => {
            (ClassRegistry.getWithMetadata as jest.Mock).mockReturnValue([]);

            await generator.generate();

            expect(ClassRegistry.getWithMetadata).toHaveBeenCalledWith(MetadataKeys.CONTROLLER);
        });

        it('should get controller metadata for each controller', async () => {
            (ClassRegistry.getWithMetadata as jest.Mock).mockReturnValue([TestController]);

            (Metadata.get as jest.Mock)
                .mockReturnValueOnce({
                    target: TestController,
                    prefix: '/users'
                })
                .mockReturnValueOnce([]);

            await generator.generate();

            expect(Metadata.get).toHaveBeenNthCalledWith(1, MetadataKeys.CONTROLLER, TestController);

            expect(Metadata.get).toHaveBeenNthCalledWith(2, MetadataKeys.ROUTE, TestController);
        });

        it('should return no routes when the controller has no route metadata', async () => {
            (ClassRegistry.getWithMetadata as jest.Mock).mockReturnValue([TestController]);

            (Metadata.get as jest.Mock)
                .mockReturnValueOnce({
                    target: TestController,
                    prefix: '/users'
                })
                .mockReturnValueOnce(undefined);

            const routes = await generator.generate();

            expect(routes).toEqual([]);
        });

        it('should generate multiple routes for a controller', async () => {
            (ClassRegistry.getWithMetadata as jest.Mock).mockReturnValue([TestController]);

            (Metadata.get as jest.Mock)
                .mockReturnValueOnce({
                    target: TestController,
                    prefix: '/users'
                })
                .mockReturnValueOnce([
                    {
                        target: TestController,
                        propertyKey: 'list',
                        method: HttpMethod.Get,
                        path: '/list'
                    },
                    {
                        target: TestController,
                        propertyKey: 'create',
                        method: HttpMethod.Post,
                        path: '/create'
                    },
                    {
                        target: TestController,
                        propertyKey: 'update',
                        method: HttpMethod.Put,
                        path: '/update'
                    }
                ]);

            const routes = await generator.generate();

            expect(routes).toHaveLength(3);

            expect(routes[0]).toMatchObject({
                target: TestController,
                propertyKey: 'list',
                httpMethod: HttpMethod.Get,
                path: '/api/users/list'
            });

            expect(routes[1]).toMatchObject({
                target: TestController,
                propertyKey: 'create',
                httpMethod: HttpMethod.Post,
                path: '/api/users/create'
            });

            expect(routes[2]).toMatchObject({
                target: TestController,
                propertyKey: 'update',
                httpMethod: HttpMethod.Put,
                path: '/api/users/update'
            });
        });

        it('should generate routes for multiple controllers', async () => {
            class AdminController {}

            (ClassRegistry.getWithMetadata as jest.Mock).mockReturnValue([TestController, AdminController]);

            (Metadata.get as jest.Mock)
                .mockReturnValueOnce({
                    target: TestController,
                    prefix: '/users'
                })
                .mockReturnValueOnce([
                    {
                        target: TestController,
                        propertyKey: 'list',
                        method: HttpMethod.Get,
                        path: '/list'
                    }
                ])
                .mockReturnValueOnce({
                    target: AdminController,
                    prefix: '/admin'
                })
                .mockReturnValueOnce([
                    {
                        target: AdminController,
                        propertyKey: 'list',
                        method: HttpMethod.Get,
                        path: '/list'
                    }
                ]);

            const routes = await generator.generate();

            expect(routes).toHaveLength(2);

            expect(routes[0].target).toBe(TestController);
            expect(routes[0].path).toBe('/api/users/list');

            expect(routes[1].target).toBe(AdminController);
            expect(routes[1].path).toBe('/api/admin/list');
        });
    });

    describe('path generation', () => {
        const generateRoute = async ({ basePath, prefix, path }: { basePath?: string; prefix: string; path: string }) => {
            options.basePath = basePath;

            (ClassRegistry.getWithMetadata as jest.Mock).mockReturnValue([TestController]);

            (Metadata.get as jest.Mock)
                .mockReturnValueOnce({
                    target: TestController,
                    prefix
                })
                .mockReturnValueOnce([
                    {
                        target: TestController,
                        propertyKey: 'list',
                        method: HttpMethod.Get,
                        path
                    }
                ]);

            const routes = await generator.generate();

            return routes[0].path;
        };

        it('should combine base path, controller prefix and route path', async () => {
            const path = await generateRoute({
                basePath: '/api',
                prefix: '/users',
                path: '/list'
            });

            expect(path).toBe('/api/users/list');
        });

        it('should add missing leading slashes', async () => {
            const path = await generateRoute({
                basePath: 'api',
                prefix: 'users',
                path: 'list'
            });

            expect(path).toBe('/api/users/list');
        });

        it('should remove duplicate slashes', async () => {
            const path = await generateRoute({
                basePath: '//api//',
                prefix: '//users//',
                path: '//list//'
            });

            expect(path).toBe('/api/users/list');
        });

        it('should remove the trailing slash', async () => {
            const path = await generateRoute({
                basePath: '/api/',
                prefix: '/users/',
                path: '/list/'
            });

            expect(path).toBe('/api/users/list');
        });

        it('should return "/" when all path segments are empty', async () => {
            const path = await generateRoute({
                basePath: '',
                prefix: '',
                path: ''
            });

            expect(path).toBe('/');
        });

        it('should work without a base path', async () => {
            const path = await generateRoute({
                basePath: undefined,
                prefix: '/users',
                path: '/list'
            });

            expect(path).toBe('/users/list');
        });

        it('should work with "/" as base path', async () => {
            const path = await generateRoute({
                basePath: '/',
                prefix: '/users',
                path: '/list'
            });

            expect(path).toBe('/users/list');
        });
    });

    describe('URI versioning', () => {
        it('should add the version parameter when URI versioning is enabled', async () => {
            options.basePath = '/api';
            options.versionOptions = {
                type: VersionType.Uri
            } as any;

            (ClassRegistry.getWithMetadata as jest.Mock).mockReturnValue([TestController]);

            (Metadata.get as jest.Mock)
                .mockReturnValueOnce({
                    target: TestController,
                    prefix: '/users'
                })
                .mockReturnValueOnce([
                    {
                        target: TestController,
                        propertyKey: 'list',
                        method: HttpMethod.Get,
                        path: '/list'
                    }
                ]);

            const routes = await generator.generate();

            expect(routes[0].path).toBe('/api/v:version/users/list');
        });

        it('should not add the version parameter for header versioning', async () => {
            options.basePath = '/api';
            options.versionOptions = {
                type: VersionType.Header
            } as any;

            (ClassRegistry.getWithMetadata as jest.Mock).mockReturnValue([TestController]);

            (Metadata.get as jest.Mock)
                .mockReturnValueOnce({
                    target: TestController,
                    prefix: '/users'
                })
                .mockReturnValueOnce([
                    {
                        target: TestController,
                        propertyKey: 'list',
                        method: HttpMethod.Get,
                        path: '/list'
                    }
                ]);

            const routes = await generator.generate();

            expect(routes[0].path).toBe('/api/users/list');
        });

        it('should not add the version parameter for media type versioning', async () => {
            options.basePath = '/api';
            options.versionOptions = {
                type: VersionType.MediaType
            } as any;

            (ClassRegistry.getWithMetadata as jest.Mock).mockReturnValue([TestController]);

            (Metadata.get as jest.Mock)
                .mockReturnValueOnce({
                    target: TestController,
                    prefix: '/users'
                })
                .mockReturnValueOnce([
                    {
                        target: TestController,
                        propertyKey: 'list',
                        method: HttpMethod.Get,
                        path: '/list'
                    }
                ]);

            const routes = await generator.generate();

            expect(routes[0].path).toBe('/api/users/list');
        });
    });

    describe('route handler', () => {
        it('should create a scoped container when the handler is called', async () => {
            (ClassRegistry.getWithMetadata as jest.Mock).mockReturnValue([TestController]);

            (Metadata.get as jest.Mock)
                .mockReturnValueOnce({
                    target: TestController,
                    prefix: '/users'
                })
                .mockReturnValueOnce([
                    {
                        target: TestController,
                        propertyKey: 'list',
                        method: HttpMethod.Get,
                        path: '/list'
                    }
                ]);

            const routes = await generator.generate();

            await routes[0].handler({
                request: {} as any,
                response: {} as any,
                session: {} as any
            });

            expect(scopedContainerManager.create).toHaveBeenCalledTimes(1);
        });

        it('should execute HttpEngine with the filled HTTP context', async () => {
            (ClassRegistry.getWithMetadata as jest.Mock).mockReturnValue([TestController]);

            const routeMetadata = {
                target: TestController,
                propertyKey: 'list',
                method: HttpMethod.Get,
                path: '/list'
            };

            (Metadata.get as jest.Mock)
                .mockReturnValueOnce({
                    target: TestController,
                    prefix: '/users'
                })
                .mockReturnValueOnce([routeMetadata]);

            const routes = await generator.generate();

            const request = {} as any;
            const response = {} as any;
            const session = {} as any;

            await routes[0].handler({
                request,
                response,
                session
            });

            expect(httpEngine.execute).toHaveBeenCalledTimes(1);

            expect(httpEngine.execute).toHaveBeenCalledWith({
                request,
                response,
                session,
                target: TestController,
                propertyKey: 'list',
                scopedContainer: 'scoped-container',
                transport: ExecutionTransport.Http,
                version: undefined,
                error: undefined
            });
        });

        it('should preserve request, response and session in the generated context', async () => {
            (ClassRegistry.getWithMetadata as jest.Mock).mockReturnValue([TestController]);

            (Metadata.get as jest.Mock)
                .mockReturnValueOnce({
                    target: TestController,
                    prefix: '/users'
                })
                .mockReturnValueOnce([
                    {
                        target: TestController,
                        propertyKey: 'list',
                        method: HttpMethod.Get,
                        path: '/list'
                    }
                ]);

            const routes = await generator.generate();

            const request = { method: 'GET' };
            const response = { statusCode: 200 };
            const session = { id: 'session' };

            await routes[0].handler({
                request: request as any,
                response: response as any,
                session: session as any
            });

            expect(httpEngine.execute).toHaveBeenCalledWith(
                expect.objectContaining({
                    request,
                    response,
                    session
                })
            );
        });

        it('should set the route target and property key in the context', async () => {
            (ClassRegistry.getWithMetadata as jest.Mock).mockReturnValue([TestController]);

            (Metadata.get as jest.Mock)
                .mockReturnValueOnce({
                    target: TestController,
                    prefix: '/users'
                })
                .mockReturnValueOnce([
                    {
                        target: TestController,
                        propertyKey: 'list',
                        method: HttpMethod.Get,
                        path: '/list'
                    }
                ]);

            const routes = await generator.generate();

            await routes[0].handler({
                request: {} as any,
                response: {} as any,
                session: {} as any
            });

            expect(httpEngine.execute).toHaveBeenCalledWith(
                expect.objectContaining({
                    target: TestController,
                    propertyKey: 'list'
                })
            );
        });

        it('should set HTTP transport in the context', async () => {
            (ClassRegistry.getWithMetadata as jest.Mock).mockReturnValue([TestController]);

            (Metadata.get as jest.Mock)
                .mockReturnValueOnce({
                    target: TestController,
                    prefix: '/users'
                })
                .mockReturnValueOnce([
                    {
                        target: TestController,
                        propertyKey: 'list',
                        method: HttpMethod.Get,
                        path: '/list'
                    }
                ]);

            const routes = await generator.generate();

            await routes[0].handler({
                request: {} as any,
                response: {} as any,
                session: {} as any
            });

            expect(httpEngine.execute).toHaveBeenCalledWith(
                expect.objectContaining({
                    transport: ExecutionTransport.Http
                })
            );
        });

        it('should initialize version and error as undefined in the context', async () => {
            (ClassRegistry.getWithMetadata as jest.Mock).mockReturnValue([TestController]);

            (Metadata.get as jest.Mock)
                .mockReturnValueOnce({
                    target: TestController,
                    prefix: '/users'
                })
                .mockReturnValueOnce([
                    {
                        target: TestController,
                        propertyKey: 'list',
                        method: HttpMethod.Get,
                        path: '/list'
                    }
                ]);

            const routes = await generator.generate();

            await routes[0].handler({
                request: {} as any,
                response: {} as any,
                session: {} as any
            });

            expect(httpEngine.execute).toHaveBeenCalledWith(
                expect.objectContaining({
                    version: undefined,
                    error: undefined
                })
            );
        });
    });

    describe('metadata', () => {
        it('should preserve the route metadata target', async () => {
            (ClassRegistry.getWithMetadata as jest.Mock).mockReturnValue([TestController]);

            const target = TestController;

            (Metadata.get as jest.Mock)
                .mockReturnValueOnce({
                    target,
                    prefix: '/users'
                })
                .mockReturnValueOnce([
                    {
                        target,
                        propertyKey: 'list',
                        method: HttpMethod.Get,
                        path: '/list'
                    }
                ]);

            const routes = await generator.generate();

            expect(routes[0].target).toBe(target);
        });

        it('should preserve the route metadata property key', async () => {
            (ClassRegistry.getWithMetadata as jest.Mock).mockReturnValue([TestController]);

            (Metadata.get as jest.Mock)
                .mockReturnValueOnce({
                    target: TestController,
                    prefix: '/users'
                })
                .mockReturnValueOnce([
                    {
                        target: TestController,
                        propertyKey: 'list',
                        method: HttpMethod.Get,
                        path: '/list'
                    }
                ]);

            const routes = await generator.generate();

            expect(routes[0].propertyKey).toBe('list');
        });

        it('should preserve the route HTTP method', async () => {
            (ClassRegistry.getWithMetadata as jest.Mock).mockReturnValue([TestController]);

            (Metadata.get as jest.Mock)
                .mockReturnValueOnce({
                    target: TestController,
                    prefix: '/users'
                })
                .mockReturnValueOnce([
                    {
                        target: TestController,
                        propertyKey: 'list',
                        method: HttpMethod.Post,
                        path: '/list'
                    }
                ]);

            const routes = await generator.generate();

            expect(routes[0].httpMethod).toBe(HttpMethod.Post);
        });
    });
});
