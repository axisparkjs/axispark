import { HttpPlugin, HttpAdapterClass } from '@axisparkjs/http';
import { FastifyHttpAdapter } from '../adapter/fastify-http-adapter';
import { HttpPluginOptionsFactory } from './http-plugin-options-factory';

describe('HttpPluginOptionsFactory', () => {
    describe('create', () => {
        it('should return the default options', () => {
            const options = HttpPluginOptionsFactory.create();

            expect(options).toEqual({
                plugin: HttpPlugin,
                port: 3000,
                basePath: undefined,
                adapter: FastifyHttpAdapter,
                bodyParser: false,
                urlEncoded: true,
                urlEncodedOptions: undefined,
                cors: false,
                corsOptions: undefined,
                session: false,
                sessionOptions: {
                    secret: 'secret'
                },
                cookies: true,
                cookiesOptions: undefined,
                compression: false,
                compressionOptions: undefined,
                healthChecks: false,
                logHttpErrors: false,
                logErrors: true,
                logHttpRequests: false,
                logHttpResponses: false
            });
        });

        it('should override the default options', () => {
            const urlEncodedOptions = {};
            const sessionOptions = { secret: 'my-secret' };
            const cookiesOptions = { secret: 'cookie-secret' };
            const compressionOptions = { threshold: 1024 };
            const corsOptions = { origin: 'http://example.com' };

            const options = HttpPluginOptionsFactory.create({
                port: 8080,
                basePath: '/api',
                adapter: class TestAdapter {} as unknown as HttpAdapterClass,
                bodyParser: false,
                urlEncoded: false,
                urlEncodedOptions,
                cors: true,
                corsOptions,
                session: true,
                sessionOptions,
                cookies: true,
                cookiesOptions,
                compression: true,
                compressionOptions,
                healthChecks: true,
                logHttpErrors: true,
                logErrors: false,
                logHttpRequests: true,
                logHttpResponses: true
            });

            expect(options).toEqual({
                plugin: HttpPlugin,
                port: 8080,
                basePath: '/api',
                adapter: expect.any(Function),
                bodyParser: false,
                urlEncoded: false,
                urlEncodedOptions,
                cors: true,
                corsOptions,
                session: true,
                sessionOptions,
                cookies: true,
                cookiesOptions,
                compression: true,
                compressionOptions,
                healthChecks: true,
                logHttpErrors: true,
                logErrors: false,
                logHttpRequests: true,
                logHttpResponses: true
            });
        });

        it('should not mutate the provided options object', () => {
            const input = {
                port: 8080,
                urlEncoded: false
            };

            const copy = { ...input };

            HttpPluginOptionsFactory.create(input);

            expect(input).toEqual(copy);
        });

        it('should always include HttpPlugin as plugin', () => {
            const options = HttpPluginOptionsFactory.create({
                port: 4000
            });

            expect(options.plugin).toBe(HttpPlugin);
        });
    });
});
