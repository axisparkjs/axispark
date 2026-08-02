import express from 'express';
import session from 'express-session';
import { ExpressHttpAdapter } from './express-http-adapter';
import { ExpressHttpRequest } from '../types/express-http-request';
import { ExpressHttpResponse } from '../types/express-http-response';
import { ExpressHttpSession } from '../types/express-http-session';
import { HttpMethod } from '@axisparkjs/http';

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

describe('ExpressHttpAdapter', () => {
    const app = (express as unknown as jest.Mock)();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('constructor', () => {
        it('should register all enabled middlewares', () => {
            new ExpressHttpAdapter({
                port: 3000,
                plugin: {} as never,
                adapter: {} as never,
                bodyParser: true,
                bodyParserOptions: { limit: '10mb' },
                urlEncoded: true,
                urlEncodedOptions: { extended: false },
                session: true,
                sessionOptions: { secret: 'secret' },
                logErrors: false,
                logHttpErrors: false,
                logHttpRequests: false,
                logHttpResponses: false
            });

            expect(express.json).toHaveBeenCalledWith({ limit: '10mb' });
            expect(express.urlencoded).toHaveBeenCalledWith({ extended: false });
            expect(session).toHaveBeenCalledWith({ secret: 'secret' });

            expect(app.use).toHaveBeenCalledTimes(3);
        });

        it('should not register disabled middlewares', () => {
            new ExpressHttpAdapter({
                port: 3000,
                plugin: {} as never,
                adapter: {} as never,
                bodyParser: false,
                bodyParserOptions: {},
                urlEncoded: false,
                urlEncodedOptions: {},
                session: false,
                logErrors: false,
                logHttpErrors: false,
                logHttpRequests: false,
                logHttpResponses: false
            });

            expect(app.use).not.toHaveBeenCalled();
        });
    });

    describe('registerRoutes', () => {
        it('should register every route', () => {
            const adapter = new ExpressHttpAdapter({
                port: 3000,
                plugin: {} as never,
                adapter: {} as never,
                bodyParser: false,
                bodyParserOptions: {},
                urlEncoded: false,
                urlEncodedOptions: {},
                session: false,
                logErrors: false,
                logHttpErrors: false,
                logHttpRequests: false,
                logHttpResponses: false
            });

            const handler = jest.fn();

            adapter.registerRoutes([
                {
                    controller: class TestController {},
                    method: HttpMethod.GET,
                    path: '/users',
                    handler
                }
            ]);

            expect(app.get).toHaveBeenCalledWith('/users', expect.any(Function));
        });

        it('should create the http context', async () => {
            const adapter = new ExpressHttpAdapter({
                port: 3000,
                plugin: {} as never,
                adapter: {} as never,
                bodyParser: false,
                bodyParserOptions: {},
                urlEncoded: false,
                urlEncodedOptions: {},
                session: false,
                logErrors: false,
                logHttpErrors: false,
                logHttpRequests: false,
                logHttpResponses: false
            });

            const handler = jest.fn();

            adapter.registerRoutes([
                {
                    controller: class TestController {},
                    method: HttpMethod.GET,
                    path: '/',
                    handler
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
                port: 3000,
                plugin: {} as never,
                adapter: {} as never,
                bodyParser: false,
                bodyParserOptions: {},
                urlEncoded: false,
                urlEncodedOptions: {},
                session: true,
                logErrors: false,
                logHttpErrors: false,
                logHttpRequests: false,
                logHttpResponses: false
            });

            const handler = jest.fn();

            adapter.registerRoutes([
                {
                    controller: class TestController {},
                    method: HttpMethod.GET,
                    path: '/',
                    handler
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

    describe('start', () => {
        it('should listen on configured port', () => {
            const server = {};

            app.listen.mockReturnValue(server);

            const adapter = new ExpressHttpAdapter({
                port: 8080,
                plugin: {} as never,
                adapter: {} as never,
                bodyParser: false,
                bodyParserOptions: {},
                urlEncoded: false,
                urlEncodedOptions: {},
                session: false,
                logErrors: false,
                logHttpErrors: false,
                logHttpRequests: false,
                logHttpResponses: false
            });

            adapter.start();

            expect(app.listen).toHaveBeenCalledWith(8080);
        });
    });

    describe('stop', () => {
        it('should close the server', () => {
            const close = jest.fn();

            app.listen.mockReturnValue({ close });

            const adapter = new ExpressHttpAdapter({
                port: 8080,
                plugin: {} as never,
                adapter: {} as never,
                bodyParser: false,
                bodyParserOptions: {},
                urlEncoded: false,
                urlEncodedOptions: {},
                session: false,
                logErrors: false,
                logHttpErrors: false,
                logHttpRequests: false,
                logHttpResponses: false
            });

            adapter.start();
            adapter.stop();

            expect(close).toHaveBeenCalled();
        });

        it('should do nothing when server has not been started', () => {
            const adapter = new ExpressHttpAdapter({
                port: 8080,
                plugin: {} as never,
                adapter: {} as never,
                bodyParser: false,
                bodyParserOptions: {},
                urlEncoded: false,
                urlEncodedOptions: {},
                session: false,
                logErrors: false,
                logHttpErrors: false,
                logHttpRequests: false,
                logHttpResponses: false
            });

            expect(() => adapter.stop()).not.toThrow();
        });
    });
});
