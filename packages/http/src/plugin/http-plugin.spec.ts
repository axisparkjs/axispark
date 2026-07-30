import { PluginNotConfiguredError } from '@axisparkjs/core';
import { Logger } from '@axisparkjs/logger';
import { ClassRegistry } from '@axisparkjs/di';
import { HttpPlugin } from './http-plugin';
import { RouteGenerator } from '../routes/route-generator';
import { HTTP_ADAPTER, HTTP_LOGGER, HTTP_OPTIONS } from '../di/tokens';
import {
    LogErrorFilter,
    LogHttpErrorFilter,
} from '../filters';
import {
    LogHttpRequestInterceptor,
    LogHttpResponseInterceptor,
} from '../interceptors';
import { HttpPluginOptions } from './http-plugin-options';

jest.mock('../routes/route-generator');
jest.mock('@axisparkjs/di', () => ({
    ...jest.requireActual('@axisparkjs/di'),
    ClassRegistry: {
        remove: jest.fn(),
    },
}));

describe('HttpPlugin', () => {
    let plugin: HttpPlugin;

    const logger = {
        child: jest.fn(),
        info: jest.fn().mockResolvedValue(undefined),
        debug: jest.fn().mockResolvedValue(undefined),
    };

    const adapter = {
        registerRoutes: jest.fn().mockResolvedValue(undefined),
        start: jest.fn().mockResolvedValue(undefined),
        stop: jest.fn().mockResolvedValue(undefined),
    };

    const container = {
        resolve: jest.fn(),
        bind: jest.fn(),
        unbind: jest.fn(),
    };

    const context: any = {
        container,
    };

    const options = {
        adapter: class TestAdapter {},
        port: 3000,
        logHttpRequests: true,
        logHttpResponses: true,
        logHttpErrors: true,
        logErrors: true,
    } as unknown as HttpPluginOptions;

    const optionsWithoutLog = {
        adapter: class TestAdapter {},
        port: 3000
    } as unknown as HttpPluginOptions;

    beforeEach(() => {
        jest.clearAllMocks();

        plugin = new HttpPlugin();

        logger.child.mockReturnValue(logger);

        container.resolve.mockImplementation((token) => {
            if (token === Logger) return logger;
            if (token === HTTP_ADAPTER) return adapter;
        });

        (RouteGenerator.generate as jest.Mock).mockReturnValue([]);
    });

    describe('onRegister', () => {
        it('should throw when options are not provided', async () => {
            await expect(plugin.onRegister(context)).rejects.toBeInstanceOf(
                PluginNotConfiguredError,
            );
        });

        it('should register container bindings', async () => {
            await plugin.onRegister(context, options);

            expect(container.bind).toHaveBeenCalledWith({
                token: HTTP_OPTIONS,
                useValue: options,
            });

            expect(container.bind).toHaveBeenCalledWith({
                token: HTTP_ADAPTER,
                useClass: options.adapter,
            });

            expect(container.bind).toHaveBeenCalledWith({
                token: HTTP_LOGGER,
                useValue: logger,
            });
        });

        it('should register generated routes', async () => {
            const routes = [
                { method: 'get', path: '/users' },
                { method: 'post', path: '/users' },
            ];

            (RouteGenerator.generate as jest.Mock).mockReturnValue([
                {
                    controller: class UsersController {},
                    routes,
                },
            ]);

            await plugin.onRegister(context, options);

            expect(adapter.registerRoutes).toHaveBeenCalledWith(routes);
        });

        it('should log every registered route', async () => {
            class UsersController {}

            (RouteGenerator.generate as jest.Mock).mockReturnValue([
                {
                    controller: UsersController,
                    routes: [
                        { method: 'get', path: '/users' },
                        { method: 'post', path: '/users' },
                    ],
                },
            ]);

            await plugin.onRegister(context, options);

            expect(logger.debug).toHaveBeenCalledWith(
                'Registered route GET /users for controller UsersController',
            );

            expect(logger.debug).toHaveBeenCalledWith(
                'Registered route POST /users for controller UsersController',
            );
        });

        it('should log registered controller', async () => {
            class UsersController {}

            (RouteGenerator.generate as jest.Mock).mockReturnValue([
                {
                    controller: UsersController,
                    routes: [],
                },
            ]);

            await plugin.onRegister(context, options);

            expect(logger.info).toHaveBeenCalledWith(
                'Registered controller UsersController',
            );
        });

        it('should log plugin registration', async () => {
            await plugin.onRegister(context, options);

            expect(logger.info).toHaveBeenCalledWith('Plugin registered');
        });
    });

    describe('configureLogging', () => {
        it('should keep all logging components when enabled', async () => {
            await plugin.onRegister(context, options);

            expect(ClassRegistry.remove).not.toHaveBeenCalled();
            expect(container.unbind).not.toHaveBeenCalled();
        });

        it.each([
            ['logHttpRequests', LogHttpRequestInterceptor],
            ['logHttpResponses', LogHttpResponseInterceptor],
            ['logHttpErrors', LogHttpErrorFilter],
            ['logErrors', LogErrorFilter],
        ])(
            'should disable %s when set to false',
            async (_flag, target) => {
                await plugin.onRegister(context, {
                    ...optionsWithoutLog,
                });

                expect(ClassRegistry.remove).toHaveBeenCalledWith(target);
                expect(container.unbind).toHaveBeenCalledWith(target);
            },
        );
    });

    describe('onStart', () => {
        beforeEach(async () => {
            await plugin.onRegister(context, options);
        });

        it('should start adapter', async () => {
            await plugin.onStart();

            expect(adapter.start).toHaveBeenCalled();
        });

        it('should log start message', async () => {
            await plugin.onStart();

            expect(logger.info).toHaveBeenCalledWith(
                'Plugin started. Listening on port 3000',
            );
        });
    });

    describe('onStop', () => {
        beforeEach(async () => {
            await plugin.onRegister(context, options);
        });

        it('should stop adapter', async () => {
            await plugin.onStop();

            expect(adapter.stop).toHaveBeenCalled();
        });

        it('should log stop message', async () => {
            await plugin.onStop();

            expect(logger.info).toHaveBeenCalledWith('Plugin stopped');
        });
    });
});