import { Request } from 'express';
import { ExpressHttpRequest } from './express-http-request';

describe('ExpressHttpRequest', () => {
    let request: jest.Mocked<Partial<Request>>;
    let httpRequest: ExpressHttpRequest;

    beforeEach(() => {
        request = {
            method: 'POST',
            path: '/users/1',
            originalUrl: '/api/users/1?active=true',
            headers: {
                authorization: 'Bearer token'
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
            },

            get: jest.fn()
        };

        httpRequest = new ExpressHttpRequest(request as Request);
    });

    it('should return the request method', () => {
        expect(httpRequest.method).toBe(request.method);
    });

    it('should return the request path', () => {
        expect(httpRequest.path).toBe(request.path);
    });

    it('should return the original url', () => {
        expect(httpRequest.url).toBe(request.originalUrl);
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
        request.cookies = { sessionId: 'abc123' };
        expect(httpRequest.cookies).toBe(request.cookies);
    });

    it('should return a cookie value', () => {
        request.cookies = { sessionId: 'abc123' };

        expect(httpRequest.getCookie('sessionId')).toBe('abc123');
    });

    it('should return undefined when the cookie does not exist', () => {
        request.cookies = { sessionId: 'abc123' };

        expect(httpRequest.getCookie('nonexistent')).toBeUndefined();
    });

    it('should return a header value', () => {
        (request.get as jest.Mock).mockReturnValue('application/json');

        expect(httpRequest.getHeader('content-type')).toBe('application/json');
        expect(request.get).toHaveBeenCalledWith('content-type');
    });

    it('should return undefined when the header does not exist', () => {
        (request.get as jest.Mock).mockReturnValue(undefined);

        expect(httpRequest.getHeader('x-test')).toBeUndefined();
        expect(request.get).toHaveBeenCalledWith('x-test');
    });
});
