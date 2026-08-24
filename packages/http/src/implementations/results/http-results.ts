import { HttpStatusCode } from '../../types/http-status-code';
import { BodyHttpResult, FileHttpResult, RedirectHttpResult, StreamHttpResult, ErrorHttpResult } from './http-result';
import { HttpError } from '../errors';

/**
 * A static class for creating HTTP results.
 */
export class HttpResultsStatic {
    public Ok(value: unknown) {
        return new BodyHttpResult(value, HttpStatusCode.Ok);
    }
    public Created(value: unknown, location?: string) {
        return new BodyHttpResult(value, HttpStatusCode.Created, location ? { Location: location } : undefined);
    }
    public Accepted(value: unknown) {
        return new BodyHttpResult(value, HttpStatusCode.Accepted);
    }
    public NoContent() {
        return new BodyHttpResult(undefined, HttpStatusCode.NoContent);
    }

    public Redirect(location: string) {
        return new RedirectHttpResult(location);
    }
    public PermanentRedirect(location: string) {
        return new RedirectHttpResult(location, true);
    }

    public File(filePath: string, contentType?: string) {
        return new FileHttpResult(filePath, contentType ? { contentType } : undefined);
    }
    public Download(filePath: string, filename: string, contentType?: string) {
        return new FileHttpResult(filePath, {
            contentType,
            filename
        });
    }
    public Stream(stream: NodeJS.ReadableStream, filename?: string, contentType?: string) {
        return new StreamHttpResult(stream, {
            contentType,
            filename
        });
    }

    public BadRequest(value: string, options?: { cause?: unknown; description?: string }) {
        const error = new HttpError(value, HttpStatusCode.BadRequest, options);
        return new ErrorHttpResult(error);
    }
    public Unauthorized(value: string, options?: { cause?: unknown; description?: string }) {
        const error = new HttpError(value, HttpStatusCode.Unauthorized, options);
        return new ErrorHttpResult(error);
    }
    public Forbidden(value: string, options?: { cause?: unknown; description?: string }) {
        const error = new HttpError(value, HttpStatusCode.Forbidden, options);
        return new ErrorHttpResult(error);
    }
    public NotFound(value: string, options?: { cause?: unknown; description?: string }) {
        const error = new HttpError(value, HttpStatusCode.NotFound, options);
        return new ErrorHttpResult(error);
    }
    public Error(error: HttpError) {
        return new ErrorHttpResult(error);
    }

    public InternalServerError(value: string, options?: { cause?: unknown; description?: string }) {
        const error = new HttpError(value, HttpStatusCode.InternalServerError, options);
        return new ErrorHttpResult(error);
    }
}
/**
 * A singleton instance of HttpResultsStatic for creating HTTP results.
 */
export const HttpResults = new HttpResultsStatic();
