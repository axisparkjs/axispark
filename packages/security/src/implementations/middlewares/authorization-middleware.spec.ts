import { ExecutionTransport } from '@axisparkjs/engine';
import { AuthorizationEngine } from '../../engine/authorization-engine';
import { AuthorizationMiddleware } from './authorization-middleware';

describe('AuthorizationMiddleware', () => {
    it('executes the authorization engine with the current context', async () => {
        const engine = { execute: jest.fn().mockResolvedValue(undefined) };
        const middleware = new AuthorizationMiddleware(engine as unknown as AuthorizationEngine);
        const context = { transport: ExecutionTransport.Http } as any;

        await middleware.authenticate(context);

        expect(engine.execute).toHaveBeenCalledWith(context);
    });
});
