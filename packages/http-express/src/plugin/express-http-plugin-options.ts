import { HttpPluginOptions } from '@axisparkjs/http';
import { SessionOptions } from 'express-session';
import { OptionsJson, OptionsUrlencoded } from 'body-parser';
import { CookieParseOptions } from 'cookie-parser';
import { CompressionOptions } from 'compression';
import { CorsOptions } from 'cors';

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
