import { HttpPluginOptions } from '@axisparkjs/http';
import { SessionOptions } from 'express-session';
import { OptionsJson, OptionsUrlencoded } from 'body-parser';
import { CookieParseOptions } from 'cookie-parser';
import { CompressionOptions } from 'compression';
import { CorsOptions } from 'cors';

/**
 * An interface extending the base HttpPluginOptions to include additional configuration options specific to the Express HTTP plugin. This includes options for body parsing, URL encoding, CORS, session management, cookie parsing, and response compression.
 */
export interface ExpressHttpPluginOptions extends HttpPluginOptions {
    bodyParserOptions?: OptionsJson;
    urlEncodedOptions?: OptionsUrlencoded;
    corsOptions?: CorsOptions;
    sessionOptions?: SessionOptions;
    cookiesOptions?: {
        secret?: string | string[];
        options?: CookieParseOptions;
    };
    compressionOptions?: CompressionOptions;
}
