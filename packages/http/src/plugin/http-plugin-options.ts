import { PluginOptions } from '@axisparkjs/core';
import { HttpAdapterClass } from '../adapter/http-adapter';
import { VersionType } from '../version';
import { HttpRequest } from '../types';

/**
 * Options for configuring the header-based version resolver.
 */
export interface HeaderVersionOptions {
    type: VersionType.Header;
    header: string;
}

/**
 * Options for configuring the media type-based version resolver.
 */
export interface MediaTypeVersionOptions {
    type: VersionType.MediaType;
    key: string;
}

/**
 * Options for configuring the URI-based version resolver.
 */
export interface UriVersionOptions {
    type: VersionType.Uri;
    defaultVersion?: string;
}

/**
 * Options for configuring the custom version resolver.
 */
export interface CustomVersionOptions {
    type: VersionType.Custom;
    resolver: (req: HttpRequest) => string | undefined;
}

/**
 * A union type for all possible version options.
 */
export type VersionOptions = HeaderVersionOptions | MediaTypeVersionOptions | UriVersionOptions | CustomVersionOptions;

export interface TimeoutOptions {
    time: number;
    message?: string | ((time: number) => string);
}

/**
 * Options for configuring the HTTP plugin.
 */
export interface HttpPluginOptions extends PluginOptions {
    port: number;
    basePath: string;
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
