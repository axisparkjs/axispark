import { PluginOptions } from '@axisparkjs/core';
import { HttpAdapterClass } from '../adapter/http-adapter';
import { VersioningOptions } from '../versioning';

export interface HttpPluginOptions extends PluginOptions {
    port: number;
    basePath?: string;
    adapter: HttpAdapterClass;
    bodyParser: boolean;
    bodyParserOptions?: any;
    urlEncoded?: boolean;
    urlEncodedOptions?: any;
    cors: boolean;
    corsOptions?: any;
    session: boolean;
    sessionOptions?: any;
    cookies: boolean;
    cookiesOptions?: any;
    compression: boolean;
    compressionOptions?: any;
    timeout: boolean;
    timeoutOptions?: {
        time: number;
        message?: string | ((time: number) => string);
    };
    versioning?: VersioningOptions
    healthChecks?: boolean;
    logHttpRequests?: boolean;
    logHttpResponses?: boolean;
    logHttpErrors?: boolean;
    logErrors?: boolean;
}
