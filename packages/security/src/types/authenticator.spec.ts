import { ExecutionTransport } from '@axisparkjs/engine';
import { Authenticator } from './authenticator';

describe('Authenticator', () => {
    it('defaults to supporting every transport', () => {
        expect(Authenticator.transports).toEqual([ExecutionTransport.All]);
    });

    it('allows implementations to provide authentication data', async () => {
        class TestAuthenticator extends Authenticator {
            authenticate = jest.fn().mockResolvedValue({ subject: 'user-1' });
        }
        const authenticator = new TestAuthenticator();
        const context = {} as any;

        await expect(authenticator.authenticate(context)).resolves.toEqual({ subject: 'user-1' });
        expect(authenticator.authenticate).toHaveBeenCalledWith(context);
    });
});
