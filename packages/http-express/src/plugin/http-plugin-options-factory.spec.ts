import { HttpPlugin, HttpAdapterClass } from '@axisparkjs/http';
import { ExpressHttpAdapter } from '../adapter/express-http-adapter';
import { HttpPluginOptionsFactory } from './http-plugin-options-factory';

describe('HttpPluginOptionsFactory', () => {
    describe('create', () => {
        it('should return the default options', () => {
            const options = HttpPluginOptionsFactory.create();

            expect(options).toEqual({
                plugin: HttpPlugin,
                port: 3000,
                adapter: ExpressHttpAdapter,
                bodyParser: true,
                bodyParserOptions: {},
                urlEncoded: true,
                urlEncodedOptions: {},
                session: false,
                sessionOptions: {},
                logHttpErrors: false,
                logErrors: true,
                logHttpRequests: false,
                logHttpResponses: false
            });
        });

        it('should override the default options', () => {
            const bodyParserOptions = { limit: '10mb' };
            const urlEncodedOptions = { extended: false };
            const sessionOptions = { secret: 'secret' };

            const options = HttpPluginOptionsFactory.create({
                port: 8080,
                adapter: class TestAdapter {} as unknown as HttpAdapterClass,
                bodyParser: false,
                bodyParserOptions,
                urlEncoded: false,
                urlEncodedOptions,
                session: true,
                sessionOptions,
                logHttpErrors: true,
                logErrors: false,
                logHttpRequests: true,
                logHttpResponses: true
            });

            expect(options).toEqual({
                plugin: HttpPlugin,
                port: 8080,
                adapter: expect.any(Function),
                bodyParser: false,
                bodyParserOptions,
                urlEncoded: false,
                urlEncodedOptions,
                session: true,
                sessionOptions,
                logHttpErrors: true,
                logErrors: false,
                logHttpRequests: true,
                logHttpResponses: true
            });
        });

        it('should not mutate the provided options object', () => {
            const input = {
                port: 8080,
                bodyParser: false
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
