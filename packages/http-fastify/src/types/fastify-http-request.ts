import { HttpRequest } from '@axisparkjs/http';
import { FastifyRequest } from 'fastify';

export class FastifyHttpRequest implements HttpRequest {
    constructor(private readonly request: FastifyRequest) {}

    get method() {
        return this.request.method;
    }

    get path() {
        return this.request.url;
    }

    get url() {
        return this.request.url;
    }

    get headers() {
        return this.request.headers;
    }

    get query() {
        return this.request.query as Record<string, string | string[]>;
    }

    get params() {
        return this.request.params as Record<string, string>;
    }

    get body() {
        return this.request.body;
    }

    get ip() {
        return this.request.ip;
    }

    get session() {
        return (
            this.request as FastifyRequest & {
                session?: unknown;
            }
        ).session;
    }

    get cookies() {
        return (
            this.request as FastifyRequest & {
                cookies: Record<string, string>;
            }
        ).cookies;
    }

    getCookie(name: string): string | undefined {
        return this.cookies[name];
    }

    getHeader(name: string): string | string[] | undefined {
        const value = this.request.headers[name.toLowerCase()];

        if (Array.isArray(value)) {
            return value;
        }

        return value;
    }
}
