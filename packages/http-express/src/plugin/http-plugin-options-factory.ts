import { Factory } from '@axisparkjs/common';
import { HttpPlugin, HttpPluginOptions } from '@axisparkjs/http';
import { ExpressHttpAdapter } from '../adapter/express-http-adapter';
import { ExpressHttpPluginOptions } from './express-http-plugin-options';

class HttpPluginOptionsFactoryStatic implements Factory<ExpressHttpPluginOptions> {
    create(options?: Partial<Omit<ExpressHttpPluginOptions, 'plugin'>>): HttpPluginOptions {
        return {
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
            logHttpResponses: false,
            ...options
        };
    }
}

export const HttpPluginOptionsFactory = new HttpPluginOptionsFactoryStatic();
