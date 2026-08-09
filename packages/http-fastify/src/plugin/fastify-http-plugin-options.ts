import { HttpPluginOptions } from '@axisparkjs/http';
import { FastifyCompressOptions } from '@fastify/compress';
import { FastifyCookieOptions } from '@fastify/cookie';
import { FastifySessionOptions } from '@fastify/session';
import { FastifyFormbodyOptions } from '@fastify/formbody';
import { FastifyCorsOptions } from '@fastify/cors';

export interface FastifyHttpPluginOptions extends HttpPluginOptions {
    bodyParser: false;
    bodyParserOptions?: never;
    urlEncodedOptions?: FastifyFormbodyOptions;
    corsOptions?: FastifyCorsOptions;
    sessionOptions: FastifySessionOptions;
    cookiesOptions?: FastifyCookieOptions;
    compressionOptions?: FastifyCompressOptions;
}
