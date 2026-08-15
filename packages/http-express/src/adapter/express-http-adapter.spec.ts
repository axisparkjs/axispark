import express from 'express';
import session from 'express-session';
import { ExpressHttpAdapter } from './express-http-adapter';
import { ExpressHttpRequest } from '../types/express-http-request';
import { ExpressHttpResponse } from '../types/express-http-response';
import { ExpressHttpSession } from '../types/express-http-session';
import { HttpMethod } from '@axisparkjs/http';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';

jest.mock('express', () => {
    const app = {
        use: jest.fn(),
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        patch: jest.fn(),
        delete: jest.fn(),
        listen: jest.fn()
    };

    return Object.assign(
        jest.fn(() => app),
        {
            json: jest.fn(() => 'json-middleware'),
            urlencoded: jest.fn(() => 'urlencoded-middleware')
        }
    );
});

jest.mock('express-session', () => jest.fn(() => 'session-middleware'));
jest.mock('cookie-parser', () => jest.fn(() => 'cookie-parser-middleware'));
jest.mock('compression', () => jest.fn(() => 'compression-middleware'));
jest.mock('cors', () => jest.fn(() => 'cors-middleware'));

describe('ExpressHttpAdapter', () => {
    const app = (express as unknown as jest.Mock)();
    const baseConfig = {
        port: 8080,
        basePath: '/',
        plugin: {} as never,
        adapter: {} as never,
        bodyParser: false,
        bodyParserOptions: {},
        urlEncoded: false,
        urlEncodedOptions: {},
        cors: false,
        session: false,
        cookies: false,
        compression: false,
        timeout: false,
        logErrors: false,
        logHttpErrors: false,
        logHttpRequests: false,
        logHttpResponses: false,
        version: true
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('constructor', () => {
        it('should register all enabled middlewares', () => {
            new ExpressHttpAdapter({
                ...baseConfig,
                bodyParser: true,
                bodyParserOptions: { limit: '10mb' },
                urlEncoded: true,
                urlEncodedOptions: { extended: false },
                cors: true,
                corsOptions: { origin: 'http://example.com' },
                session: true,
                sessionOptions: { secret: 'secret' },
                cookies: true,
                cookiesOptions: { secret: 'secret', options: undefined },
                compression: true,
                compressionOptions: { threshold: 1024 }
            });

            expect(express.json).toHaveBeenCalledWith({ limit: '10mb' });
            expect(express.urlencoded).toHaveBeenCalledWith({ extended: false });
            expect(session).toHaveBeenCalledWith({ secret: 'secret' });
            expect(cookieParser).toHaveBeenCalledWith('secret', undefined);
            expect(compression).toHaveBeenCalledWith({ threshold: 1024 });
            expect(cors).toHaveBeenCalledWith({ origin: 'http://example.com' });

            expect(app.use).toHaveBeenCalledTimes(6);
        });

        it('should not register disabled middlewares', () => {
            new ExpressHttpAdapter({
                ...baseConfig,
                bodyParser: false,
                urlEncoded: false,
                session: false,
                cookies: false,
                compression: false,
                cors: false
            });

            expect(app.use).not.toHaveBeenCalled();
        });

        it('should register cookies without options', () => {
            new ExpressHttpAdapter({
                ...baseConfig,
                cookies: true
            });

            expect(app.use).toHaveBeenCalled();
        });
    });

    describe('registerRoutes', () => {
        it('should register every route', () => {
            const adapter = new ExpressHttpAdapter(baseConfig);

            const handler = jest.fn();

            adapter.registerRoutes([
                {
                    target: class TestController {},
                    httpMethod: HttpMethod.Get,
                    path: '/users',
                    handler,
                    versions: ['v1', 'v2'],
                    propertyKey: 'getUsers'
                }
            ]);

            expect(app.get).toHaveBeenCalledWith('/users', expect.any(Function));
        });

        it('should create the http context', async () => {
            const adapter = new ExpressHttpAdapter(baseConfig);

            const handler = jest.fn();

            adapter.registerRoutes([
                {
                    target: class TestController {},
                    httpMethod: HttpMethod.Get,
                    path: '/',
                    handler,
                    versions: ['v1', 'v2'],
                    propertyKey: 'test'
                }
            ]);

            const callback = app.get.mock.calls[0][1];

            const req = {};
            const res = {};

            await callback(req, res);

            expect(handler).toHaveBeenCalledWith({
                request: expect.any(ExpressHttpRequest),
                response: expect.any(ExpressHttpResponse),
                session: undefined
            });
        });

        it('should include session when available', async () => {
            const adapter = new ExpressHttpAdapter({
                ...baseConfig,
                session: true,
                sessionOptions: { secret: 'secret' }
            });

            const handler = jest.fn();

            adapter.registerRoutes([
                {
                    target: class TestController {},
                    httpMethod: HttpMethod.Get,
                    path: '/',
                    handler,
                    versions: ['v1', 'v2'],
                    propertyKey: 'test'
                }
            ]);

            const callback = app.get.mock.calls[0][1];

            await callback({ session: {} }, {});

            expect(handler).toHaveBeenCalledWith({
                request: expect.any(ExpressHttpRequest),
                response: expect.any(ExpressHttpResponse),
                session: expect.any(ExpressHttpSession)
            });
        });
    });

    describe('getRegisteredRoutes', () => {
        it('should return all registered routes', () => {
            const adapter = new ExpressHttpAdapter(baseConfig);

            const handler = jest.fn();

            const routes = [
                {
                    target: class TestController {},
                    httpMethod: HttpMethod.Get,
                    path: '/users',
                    handler,
                    versions: ['v1', 'v2'],
                    propertyKey: 'getUsers'
                }
            ];

            adapter.registerRoutes(routes);

            expect(adapter.getRegisteredRoutes()).toEqual(routes);
        });
    });

    describe('start', () => {
        it('should listen on configured port', () => {
            const server = {};

            app.listen.mockReturnValue(server);

            const adapter = new ExpressHttpAdapter(baseConfig);

            adapter.start();

            expect(app.listen).toHaveBeenCalledWith(8080);
        });
    });

    describe('stop', () => {
        it('should close the server', () => {
            const close = jest.fn();

            app.listen.mockReturnValue({ close });

            const adapter = new ExpressHttpAdapter(baseConfig);

            adapter.start();
            adapter.stop();

            expect(close).toHaveBeenCalled();
        });

        it('should do nothing when server has not been started', () => {
            const adapter = new ExpressHttpAdapter(baseConfig);

            expect(() => adapter.stop()).not.toThrow();
        });
    });
});
