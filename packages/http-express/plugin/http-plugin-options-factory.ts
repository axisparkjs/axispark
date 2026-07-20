import { Factory } from '@axisparkjs/common/src';
import { HttpPlugin } from '../../http/plugin/http-plugin';
import { HttpPluginOptions } from '../../http/plugin/http-plugin-options';
import { ExpressHttpAdapter } from '../adapter/express-http-adapter';

export class HttpPluginOptionsFactoryStatic implements Factory<HttpPluginOptions> {
    create(options?: Partial<Omit<HttpPluginOptions, 'plugin'>>): HttpPluginOptions {
        return {
            plugin: HttpPlugin,
            port: 3000,
            controllers: [],
            errorHandlers: [],
            adapter: ExpressHttpAdapter,
            bodyParser: true,
            bodyParserOptions: {},
            urlEncoded: true,
            urlEncodedOptions: {},
            logHttpErrors: false,
            logUnknownErrors: true,
            logHttpRequests: false,
            logHttpResponses: false,
            ...options
        };
    }
}

export const HttpPluginOptionsFactory = new HttpPluginOptionsFactoryStatic();
