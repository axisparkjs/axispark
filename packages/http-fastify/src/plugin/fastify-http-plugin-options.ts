import { HttpPluginOptions } from '@axisparkjs/http';
import { FastifyCompressOptions } from '@fastify/compress';
import { FastifyCookieOptions } from '@fastify/cookie';
import { FastifySessionOptions } from '@fastify/session';
import { FastifyFormbodyOptions } from '@fastify/formbody';
import { FastifyCorsOptions } from '@fastify/cors';

/**
 * An interface extending the base HttpPluginOptions to include additional configuration options specific to the Fastify HTTP plugin. This includes options for body parsing, URL encoding, CORS, session management, cookie parsing, and response compression.
 */
export interface FastifyHttpPluginOptions extends HttpPluginOptions {
    bodyParser: false;
    bodyParserOptions?: never;
    urlEncodedOptions?: FastifyFormbodyOptions;
    corsOptions?: FastifyCorsOptions;
    sessionOptions: FastifySessionOptions;
    cookiesOptions?: FastifyCookieOptions;
    compressionOptions?: FastifyCompressOptions;
}
