import { HttpResults } from './http-results';
import { BodyHttpResult, ErrorHttpResult, FileHttpResult, RedirectHttpResult, StreamHttpResult } from './http-result';
import { HttpError } from '../errors';
import { HttpStatusCode } from '../types';

describe('HttpResults', () => {
    describe('success results', () => {
        it('should create an OK result', () => {
            const result = HttpResults.Ok({ ok: true });

            expect(result).toBeInstanceOf(BodyHttpResult);
            expect(result.value).toEqual({ ok: true });
            expect(result.rc).toBe(HttpStatusCode.Ok);
        });

        it('should create a Created result', () => {
            const result = HttpResults.Created({ id: 1 });

            expect(result).toBeInstanceOf(BodyHttpResult);
            expect(result.rc).toBe(HttpStatusCode.Created);
        });

        it('should create a Created result with Location header', () => {
            const result = HttpResults.Created({ id: 1 }, '/users/1');

            expect(result).toBeInstanceOf(BodyHttpResult);
            expect((result as any).headers).toEqual({
                Location: '/users/1'
            });
        });

        it('should create an Accepted result', () => {
            expect(HttpResults.Accepted({}))
                .toBeInstanceOf(BodyHttpResult);
        });

        it('should create a NoContent result', () => {
            const result = HttpResults.NoContent();

            expect(result).toBeInstanceOf(BodyHttpResult);
            expect(result.value).toBeUndefined();
            expect(result.rc).toBe(HttpStatusCode.NoContent);
        });
    });

    describe('redirect results', () => {
        it('should create a temporary redirect', () => {
            expect(HttpResults.Redirect('/login'))
                .toBeInstanceOf(RedirectHttpResult);
        });

        it('should create a permanent redirect', () => {
            expect(HttpResults.PermanentRedirect('/login'))
                .toBeInstanceOf(RedirectHttpResult);
        });
    });

    describe('file results', () => {
        it('should create a file result', () => {
            expect(HttpResults.File('/tmp/file.txt'))
                .toBeInstanceOf(FileHttpResult);
        });

        it('should create a file result with content type', () => {
            const result = HttpResults.File('/tmp/file.txt', 'text/plain');

            expect(result).toBeInstanceOf(FileHttpResult);
            expect((result as any).options).toEqual({ contentType: 'text/plain' });
        });

        it('should create a download result', () => {
            expect(HttpResults.Download('/tmp/file.txt', 'file.txt'))
                .toBeInstanceOf(FileHttpResult);
        });

        it('should create a stream result', () => {
            const stream = {} as NodeJS.ReadableStream;

            expect(HttpResults.Stream(stream))
                .toBeInstanceOf(StreamHttpResult);
        });
    });

    describe('error results', () => {
        it.each([
            ['BadRequest', HttpStatusCode.BadRequest],
            ['Unauthorized', HttpStatusCode.Unauthorized],
            ['Forbidden', HttpStatusCode.Forbidden],
            ['NotFound', HttpStatusCode.NotFound],
            ['InternalServerError', HttpStatusCode.InternalServerError],
        ])('should create %s', (method, status) => {
            const result = (HttpResults as any)[method]('error');

            expect(result).toBeInstanceOf(ErrorHttpResult);
            expect(result.value).toBeInstanceOf(HttpError);
            expect(result.value.status).toBe(status);
            expect(result.value.message).toBe('error');
        });

        it('should wrap an existing HttpError', () => {
            const error = new HttpError('error', HttpStatusCode.BadRequest);

            const result = HttpResults.Error(error);

            expect(result).toBeInstanceOf(ErrorHttpResult);
            expect(result.value).toBe(error);
        });
    });
});