import { ExecutionTransport } from '@axisparkjs/engine';
import { AuthenticationEngine } from '../../engine/authentication-engine';
import { AuthenticationMiddleware } from './authentication-middleware';

describe('AuthenticationMiddleware', () => {
    it('runs authentication when the configured transport includes the current transport', async () => {
        const engine = { execute: jest.fn().mockResolvedValue(undefined) };
        const middleware = new AuthenticationMiddleware(
            { authenticator: { transports: [ExecutionTransport.Http] } } as any,
            engine as unknown as AuthenticationEngine
        );
        const context = { transport: ExecutionTransport.Http } as any;

        await middleware.authenticate(context);

        expect(engine.execute).toHaveBeenCalledWith(context);
    });

    it('runs authentication when all transports are configured', async () => {
        const engine = { execute: jest.fn().mockResolvedValue(undefined) };
        const middleware = new AuthenticationMiddleware(
            { authenticator: { transports: [ExecutionTransport.All] } } as any,
            engine as unknown as AuthenticationEngine
        );

        await middleware.authenticate({ transport: ExecutionTransport.Http } as any);

        expect(engine.execute).toHaveBeenCalledTimes(1);
    });

    it('skips authentication for a transport outside the configured list', async () => {
        const engine = { execute: jest.fn() };
        const middleware = new AuthenticationMiddleware(
            { authenticator: { transports: [ExecutionTransport.Other] } } as any,
            engine as unknown as AuthenticationEngine
        );

        await middleware.authenticate({ transport: ExecutionTransport.Http } as any);

        expect(engine.execute).not.toHaveBeenCalled();
    });

    it('defaults to all transports when no list is configured', async () => {
        const engine = { execute: jest.fn().mockResolvedValue(undefined) };
        const middleware = new AuthenticationMiddleware({ authenticator: {} } as any, engine as unknown as AuthenticationEngine);

        await middleware.authenticate({ transport: ExecutionTransport.Http } as any);

        expect(engine.execute).toHaveBeenCalledTimes(1);
    });

    it('defaults to all transports when authenticator options are omitted', async () => {
        const engine = { execute: jest.fn().mockResolvedValue(undefined) };
        const middleware = new AuthenticationMiddleware({} as any, engine as unknown as AuthenticationEngine);

        await middleware.authenticate({ transport: ExecutionTransport.Other } as any);

        expect(engine.execute).toHaveBeenCalledTimes(1);
    });
});
