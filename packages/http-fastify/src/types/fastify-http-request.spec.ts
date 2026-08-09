import { FastifyRequest } from 'fastify';
import { FastifyHttpRequest } from './fastify-http-request';

describe('FastifyHttpRequest', () => {
    let request: jest.Mocked<Partial<FastifyRequest>>;
    let httpRequest: FastifyHttpRequest;

    beforeEach(() => {
        request = {
            method: 'POST',
            url: '/api/users/1?active=true',
            headers: {
                authorization: 'Bearer token',
                'content-type': 'application/json'
            },
            query: {
                active: 'true'
            },
            params: {
                id: '1'
            },
            body: {
                name: 'John'
            },
            ip: '127.0.0.1',
            session: {
                userId: '123'
            } as never,
            cookies: {
                sessionId: 'abc123'
            }
        } as jest.Mocked<Partial<FastifyRequest>>;

        httpRequest = new FastifyHttpRequest(request as FastifyRequest);
    });

    it('should return the request method', () => {
        expect(httpRequest.method).toBe(request.method);
    });

    it('should return the request path', () => {
        expect(httpRequest.path).toBe(request.url);
    });

    it('should return the request url', () => {
        expect(httpRequest.url).toBe(request.url);
    });

    it('should return the request headers', () => {
        expect(httpRequest.headers).toBe(request.headers);
    });

    it('should return the request query', () => {
        expect(httpRequest.query).toBe(request.query);
    });

    it('should return the request params', () => {
        expect(httpRequest.params).toBe(request.params);
    });

    it('should return the request body', () => {
        expect(httpRequest.body).toBe(request.body);
    });

    it('should return the request ip', () => {
        expect(httpRequest.ip).toBe(request.ip);
    });

    it('should return the request session', () => {
        expect(httpRequest.session).toBe(request.session);
    });

    it('should return the request cookies', () => {
        expect(httpRequest.cookies).toBe(request.cookies);
    });

    it('should return a cookie value', () => {
        expect(httpRequest.getCookie('sessionId')).toBe('abc123');
    });

    it('should return undefined when the cookie does not exist', () => {
        expect(httpRequest.getCookie('nonexistent')).toBeUndefined();
    });

    describe('getHeader', () => {
        it('should return a header value', () => {
            expect(httpRequest.getHeader('content-type')).toBe('application/json');
        });

        it('should return an array header value', () => {
            request.headers = {
                'x-test': ['a', 'b']
            };

            expect(httpRequest.getHeader('x-test')).toEqual(['a', 'b']);
        });

        it('should return undefined when the header does not exist', () => {
            expect(httpRequest.getHeader('x-test')).toBeUndefined();
        });

        it('should be case insensitive', () => {
            expect(httpRequest.getHeader('Content-Type')).toBe('application/json');
        });
    });
});
