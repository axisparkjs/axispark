import { ResultDefinition } from '@axisparkjs/engine';
import { HttpStatusCode, HttpContext } from '../../types';
import { HttpError } from '../errors';

export abstract class HttpResult<T = unknown> extends ResultDefinition<T> {
    public constructor(value: T, rc: HttpStatusCode) {
        super(value, rc);
    }

    abstract process(context: HttpContext): Promise<void>;
}
export class BodyHttpResult<T = unknown> extends HttpResult<T> {
    public constructor(
        value: T,
        rc: HttpStatusCode,
        private readonly headers: Record<string, string> = {}
    ) {
        super(value, rc);
    }

    public header(name: string, value: string): this {
        this.headers[name] = value;
        return this;
    }

    public async process(context: HttpContext): Promise<void> {
        context.response.status(this.rc);
        for (const [name, value] of Object.entries(this.headers)) {
            context.response.header(name, value);
        }
        if (this.value === undefined) {
            context.response.end();
            return;
        }
        if (typeof this.value === 'string') {
            context.response.send(this.value);
            return;
        }
        context.response.json(this.value);
    }
}
export class RedirectHttpResult extends HttpResult<undefined> {
    public constructor(
        private readonly location: string,
        permanent = false
    ) {
        const rc = permanent ? HttpStatusCode.MovedPermanently : HttpStatusCode.Found;
        super(undefined, rc);
    }

    public async process(context: HttpContext): Promise<void> {
        context.response.status(this.rc);
        context.response.header('Location', this.location);
        context.response.end();
    }
}
export class FileHttpResult extends HttpResult<undefined> {
    public constructor(
        private readonly filePath: string,
        private readonly options?: { filename?: string; contentType?: string }
    ) {
        super(undefined, HttpStatusCode.Ok);
    }

    public async process(context: HttpContext): Promise<void> {
        const { filename, contentType } = this.options || {};
        if (contentType) {
            context.response.header('Content-Type', contentType);
        }
        if (filename) {
            context.response.header('Content-Disposition', `attachment; filename="${filename}"`);
        }
        context.response.file(this.filePath);
    }
}
export class StreamHttpResult extends HttpResult<undefined> {
    public constructor(
        private readonly stream: NodeJS.ReadableStream,
        private readonly options?: { filename?: string; contentType?: string }
    ) {
        super(undefined, HttpStatusCode.Ok);
    }

    public async process(context: HttpContext): Promise<void> {
        const { filename, contentType } = this.options || {};
        if (contentType) {
            context.response.header('Content-Type', contentType);
        }
        if (filename) {
            context.response.header('Content-Disposition', `attachment; filename="${filename}"`);
        }
        context.response.stream(this.stream);
    }
}
export class ErrorHttpResult extends HttpResult<HttpError> {
    public constructor(value: HttpError) {
        super(value, value.status);
    }

    public async process(context: HttpContext): Promise<void> {
        context.response.status(this.rc);
        context.response.json({
            error: this.value.message,
            status: this.rc,
            cause: this.value.options?.cause,
            description: this.value.options?.description
        });
    }
}
