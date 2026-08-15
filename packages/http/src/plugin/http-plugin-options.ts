import { PluginOptions } from '@axisparkjs/core';
import { HttpAdapterClass } from '../adapter/http-adapter';
import { VersionType } from '../version';
import { HttpRequest } from '../types';

export interface HeaderVersionOptions {
    type: VersionType.Header;
    header: string;
}

export interface MediaTypeVersionOptions {
    type: VersionType.MediaType;
    key: string;
}

export interface UriVersionOptions {
    type: VersionType.Uri;
    defaultVersion?: string;
}

export interface CustomVersionOptions {
    type: VersionType.Custom;
    resolver: (req: HttpRequest) => string | undefined;
}

export type VersionOptions = HeaderVersionOptions | MediaTypeVersionOptions | UriVersionOptions | CustomVersionOptions;

export interface TimeoutOptions {
    time: number;
    message?: string | ((time: number) => string);
}

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
    timeoutOptions?: TimeoutOptions;
    version: boolean;
    versionOptions?: VersionOptions;
    healthChecks?: boolean;
    logHttpRequests?: boolean;
    logHttpResponses?: boolean;
    logHttpErrors?: boolean;
    logErrors?: boolean;
}
