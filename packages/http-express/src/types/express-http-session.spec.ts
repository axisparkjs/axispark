import { ExpressHttpSession } from './express-http-session';
import { Session, SessionData } from 'express-session';

interface TestSession {
    userId: string;
    role: string;
}

describe('ExpressHttpSession', () => {
    let session: Session & Partial<SessionData>;
    let httpSession: ExpressHttpSession<TestSession>;

    beforeEach(() => {
        session = {
            id: 'session-id',
            cookie: {},
            userId: '1',
            role: 'admin',
            save: jest.fn(),
            reload: jest.fn(),
            regenerate: jest.fn(),
            destroy: jest.fn(),
            touch: jest.fn()
        } as unknown as Session & Partial<SessionData>;

        httpSession = new ExpressHttpSession<TestSession>(session);
    });

    describe('properties', () => {
        it('should return the session id', () => {
            expect(httpSession.id).toBe('session-id');
        });

        it('should return the session data', () => {
            expect(httpSession.data).toBe(session);
        });
    });

    describe('get', () => {
        it('should return an existing value', () => {
            expect(httpSession.get('userId')).toBe('1');
        });

        it('should return undefined for a missing value', () => {
            expect(httpSession.get('role')).toBe('admin');
        });
    });

    describe('set', () => {
        it('should set a value', () => {
            httpSession.set('userId', '2');

            expect((session as any).userId).toBe('2');
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
            expect((session as any).userId).toBeUndefined();
        });
    });

    describe('clear', () => {
        it('should remove user data but keep framework properties', () => {
            httpSession.clear();

            expect((session as any).userId).toBeUndefined();
            expect((session as any).role).toBeUndefined();

            expect(session.id).toBe('session-id');
            expect(session.cookie).toBeDefined();
            expect(session.save).toBeDefined();
            expect(session.reload).toBeDefined();
            expect(session.regenerate).toBeDefined();
            expect(session.destroy).toBeDefined();
            expect(session.touch).toBeDefined();
        });
    });

    describe('save', () => {
        it('should resolve when save succeeds', async () => {
            (session.save as jest.Mock).mockImplementation((cb) => cb());

            await expect(httpSession.save()).resolves.toBeUndefined();
        });

        it('should reject when save fails', async () => {
            const error = new Error('save');

            (session.save as jest.Mock).mockImplementation((cb) => cb(error));

            await expect(httpSession.save()).rejects.toThrow(error);
        });
    });

    describe('reload', () => {
        it('should resolve when reload succeeds', async () => {
            (session.reload as jest.Mock).mockImplementation((cb) => cb());

            await expect(httpSession.reload()).resolves.toBeUndefined();
        });

        it('should reject when reload fails', async () => {
            const error = new Error('reload');

            (session.reload as jest.Mock).mockImplementation((cb) => cb(error));

            await expect(httpSession.reload()).rejects.toThrow(error);
        });
    });

    describe('regenerate', () => {
        it('should resolve when regenerate succeeds', async () => {
            (session.regenerate as jest.Mock).mockImplementation((cb) => cb());

            await expect(httpSession.regenerate()).resolves.toBeUndefined();
        });

        it('should reject when regenerate fails', async () => {
            const error = new Error('regenerate');

            (session.regenerate as jest.Mock).mockImplementation((cb) => cb(error));

            await expect(httpSession.regenerate()).rejects.toThrow(error);
        });
    });

    describe('destroy', () => {
        it('should resolve when destroy succeeds', async () => {
            (session.destroy as jest.Mock).mockImplementation((cb) => cb());

            await expect(httpSession.destroy()).resolves.toBeUndefined();
        });

        it('should reject when destroy fails', async () => {
            const error = new Error('destroy');

            (session.destroy as jest.Mock).mockImplementation((cb) => cb(error));

            await expect(httpSession.destroy()).rejects.toThrow(error);
        });
    });

    describe('touch', () => {
        it('should call touch', async () => {
            await httpSession.touch();

            expect(session.touch).toHaveBeenCalled();
        });
    });
});
