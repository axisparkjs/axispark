import { FastifySessionObject } from '@fastify/session';
import { FastifyHttpSession } from './fastify-http-session';

interface TestSession {
    userId: string;
    role: string;
}

describe('FastifyHttpSession', () => {
    let session: FastifySessionObject & Partial<{ data: TestSession }>;
    let httpSession: FastifyHttpSession<TestSession>;

    beforeEach(() => {
        session = {
            sessionId: 'session-id',
            encryptedSessionId: 'encrypted-session-id',
            cookie: {},
            data: {
                userId: '1',
                role: 'admin'
            },
            save: jest.fn().mockResolvedValue(undefined),
            regenerate: jest.fn().mockResolvedValue(undefined),
            destroy: jest.fn().mockResolvedValue(undefined),
            touch: jest.fn()
        } as unknown as FastifySessionObject & Partial<{ data: TestSession }>;

        httpSession = new FastifyHttpSession<TestSession>(session);
    });

    describe('properties', () => {
        it('should return the session id', () => {
            expect(httpSession.id).toBe('session-id');
        });

        it('should return the session data', () => {
            expect(httpSession.data).toBe((session as any).data);
        });
    });

    describe('get', () => {
        it('should return an existing value', () => {
            expect(httpSession.get('userId')).toBe('1');
        });

        it('should return another existing value', () => {
            expect(httpSession.get('role')).toBe('admin');
        });

        it('should return undefined for a missing value', () => {
            expect(httpSession.get('missing' as never)).toBeUndefined();
        });
    });

    describe('set', () => {
        it('should set a value', () => {
            httpSession.set('userId', '2');

            expect((session as any).data.userId).toBe('2');
        });
    });

    describe('has', () => {
        it('should return true when the key exists', () => {
            expect(httpSession.has('userId')).toBe(true);
        });

        it('should return false when the key does not exist', () => {
            expect(httpSession.has('missing' as never)).toBe(false);
        });
    });

    describe('delete', () => {
        it('should delete an existing key', () => {
            expect(httpSession.delete('userId')).toBe(true);

            expect((session as any).data.userId).toBeUndefined();
        });
    });

    describe('clear', () => {
        it('should remove only session data', () => {
            httpSession.clear();

            expect((session as any).data).toEqual({});

            expect(session.sessionId).toBe('session-id');
            expect(session.encryptedSessionId).toBe('encrypted-session-id');
            expect(session.cookie).toBeDefined();
            expect(session.save).toBeDefined();
            expect(session.regenerate).toBeDefined();
            expect(session.destroy).toBeDefined();
            expect(session.touch).toBeDefined();
        });
    });

    describe('save', () => {
        it('should resolve when save succeeds', async () => {
            await expect(httpSession.save()).resolves.toBeUndefined();

            expect(session.save).toHaveBeenCalled();
        });

        it('should reject when save fails', async () => {
            const error = new Error('save');

            (session.save as jest.Mock).mockRejectedValue(error);

            await expect(httpSession.save()).rejects.toThrow(error);
        });
    });

    describe('reload', () => {
        it('should resolve when regenerate succeeds', async () => {
            await expect(httpSession.reload()).resolves.toBeUndefined();

            expect(session.regenerate).toHaveBeenCalled();
        });

        it('should reject when regenerate fails', async () => {
            const error = new Error('reload');

            (session.regenerate as jest.Mock).mockRejectedValue(error);

            await expect(httpSession.reload()).rejects.toThrow(error);
        });
    });

    describe('regenerate', () => {
        it('should resolve when regenerate succeeds', async () => {
            await expect(httpSession.regenerate()).resolves.toBeUndefined();

            expect(session.regenerate).toHaveBeenCalled();
        });

        it('should reject when regenerate fails', async () => {
            const error = new Error('regenerate');

            (session.regenerate as jest.Mock).mockRejectedValue(error);

            await expect(httpSession.regenerate()).rejects.toThrow(error);
        });
    });

    describe('destroy', () => {
        it('should resolve when destroy succeeds', async () => {
            await expect(httpSession.destroy()).resolves.toBeUndefined();

            expect(session.destroy).toHaveBeenCalled();
        });

        it('should reject when destroy fails', async () => {
            const error = new Error('destroy');

            (session.destroy as jest.Mock).mockRejectedValue(error);

            await expect(httpSession.destroy()).rejects.toThrow(error);
        });
    });

    describe('touch', () => {
        it('should call touch', async () => {
            await httpSession.touch();

            expect(session.touch).toHaveBeenCalled();
        });
    });

    describe('constructor', () => {
        it('should initialize data when it does not exist', () => {
            const sessionWithoutData = {
                sessionId: 'session-id',
                encryptedSessionId: 'encrypted-session-id',
                cookie: {},
                save: jest.fn().mockResolvedValue(undefined),
                regenerate: jest.fn().mockResolvedValue(undefined),
                destroy: jest.fn().mockResolvedValue(undefined),
                touch: jest.fn()
            } as unknown as FastifySessionObject;

            const wrapper = new FastifyHttpSession<TestSession>(sessionWithoutData);

            expect(wrapper.data).toEqual({});
        });

        it('should preserve existing data', () => {
            expect(httpSession.data).toEqual({
                userId: '1',
                role: 'admin'
            });
        });
    });
});
