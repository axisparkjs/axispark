import { Factory } from '@axisparkjs/common';
import { HttpPlugin } from '@axisparkjs/http';
import { FastifyHttpAdapter } from '../adapter/fastify-http-adapter';
import { FastifyHttpPluginOptions } from './fastify-http-plugin-options';

class HttpPluginOptionsFactoryStatic implements Factory<FastifyHttpPluginOptions> {
    create(options?: Partial<Omit<FastifyHttpPluginOptions, 'plugin'>>): FastifyHttpPluginOptions {
        return {
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
            timeout: true,
            timeoutOptions: {
                time: 5000
            },
            logHttpErrors: false,
            logErrors: true,
            logHttpRequests: false,
            logHttpResponses: false,
            ...options
        };
    }
}

export const HttpPluginOptionsFactory = new HttpPluginOptionsFactoryStatic();
