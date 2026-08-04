import { RequestResolver, ResponseResolver, BodyResolver, ParamResolver, QueryResolver, HeaderResolver, IpResolver, SessionResolver, CookieResolver } from './resolvers';

describe('ParameterResolvers', () => {
    const httpContext: any = {
        request: {
            body: { name: 'John' },
            params: {
                id: '123'
            },
            query: {
                search: 'test'
            },
            headers: {
                authorization: 'Bearer token'
            },
            ip: '127.0.0.1'
        },
        response: {
            status: jest.fn(),
            json: jest.fn()
        },
        session: {
            userId: 1
        }
    };

    describe('RequestResolver', () => {
        it('should return request', () => {
            const resolver = new RequestResolver();

            expect(resolver.resolve(httpContext)).toBe(httpContext.request);
        });
    });

    describe('ResponseResolver', () => {
        it('should return response', () => {
            const resolver = new ResponseResolver();

            expect(resolver.resolve(httpContext)).toBe(httpContext.response);
        });
    });

    describe('BodyResolver', () => {
        it('should return request body', () => {
            const resolver = new BodyResolver();

            expect(resolver.resolve(httpContext)).toEqual(httpContext.request.body);
        });
    });

    describe('ParamResolver', () => {
        it('should return parameter by name', () => {
            const resolver = new ParamResolver();

            expect(resolver.resolve(httpContext, { name: 'id' } as any)).toBe('123');
        });

        it('should return undefined when parameter does not exist', () => {
            const resolver = new ParamResolver();

            expect(resolver.resolve(httpContext, { name: 'unknown' } as any)).toBeUndefined();
        });
    });

    describe('QueryResolver', () => {
        it('should return query parameter by name', () => {
            const resolver = new QueryResolver();

            expect(resolver.resolve(httpContext, { name: 'search' } as any)).toBe('test');
        });

        it('should return undefined when query parameter does not exist', () => {
            const resolver = new QueryResolver();

            expect(resolver.resolve(httpContext, { name: 'missing' } as any)).toBeUndefined();
        });
    });

    describe('HeaderResolver', () => {
        it('should return header by name', () => {
            const resolver = new HeaderResolver();

            expect(resolver.resolve(httpContext, { name: 'authorization' } as any)).toBe('Bearer token');
        });

        it('should return undefined when header does not exist', () => {
            const resolver = new HeaderResolver();

            expect(resolver.resolve(httpContext, { name: 'missing' } as any)).toBeUndefined();
        });
    });

    describe('IpResolver', () => {
        it('should return request ip', () => {
            const resolver = new IpResolver();

            expect(resolver.resolve(httpContext)).toBe('127.0.0.1');
        });
    });

    describe('SessionResolver', () => {
        it('should return session', () => {
            const resolver = new SessionResolver();

            expect(resolver.resolve(httpContext)).toBe(httpContext.session);
        });
    });

    describe('CookieResolver', () => {
        it('should return cookie by name', () => {
            const resolver = new CookieResolver();

            httpContext.request.cookies = { sessionId: 'abc123' };

            expect(resolver.resolve(httpContext, { name: 'sessionId' } as any)).toBe('abc123');
        });

        it('should return undefined when cookie does not exist', () => {
            const resolver = new CookieResolver();

            httpContext.request.cookies = { sessionId: 'abc123' };

            expect(resolver.resolve(httpContext, { name: 'missing' } as any)).toBeUndefined();
        });
    });
});
