import { HttpResponse } from '@axisparkjs/http';
import { Response } from 'express';

export class ExpressHttpResponse implements HttpResponse {
    constructor(private readonly response: Response) {}

    status(code: number): this {
        this.response.status(code);
        return this;
    }

    header(name: string, value: string): this {
        this.response.setHeader(name, value);
        return this;
    }

    json(body: unknown): void {
        this.response.json(body);
    }

    send(body: unknown): void {
        this.response.send(body);
    }

    end(): void {
        this.response.end();
    }

    isCommitted(): boolean {
        return this.response.headersSent;
    }
}
