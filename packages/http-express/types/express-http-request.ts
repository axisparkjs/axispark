import { HttpRequest } from '@axisparkjs/http';
import { Request } from 'express';

export class ExpressHttpRequest implements HttpRequest {
    constructor(private readonly request: Request) {}

    get method() {
        return this.request.method;
    }

    get path() {
        return this.request.path;
    }

    get url() {
        return this.request.originalUrl;
    }

    get headers() {
        return this.request.headers;
    }

    get query() {
        return this.request.query as Record<string, string | string[]>;
    }

    get params() {
        return this.request.params;
    }

    get body() {
        return this.request.body;
    }

    getHeader(name: string): string | string[] | undefined {
        return this.request.get(name);
    }
}
