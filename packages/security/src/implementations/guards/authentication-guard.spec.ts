import { AuthenticationError } from '../errors';
import { AuthenticationGuard } from './authentication-guard';

describe('AuthenticationGuard', () => {
    const guard = new AuthenticationGuard();

    it('allows unprotected methods', async () => {
        await expect(guard.checkAuthentication({ securedMethod: false, authenticated: false } as any)).resolves.toBeUndefined();
    });

    it('allows authenticated secured methods', async () => {
        await expect(guard.checkAuthentication({ securedMethod: true, authenticated: true } as any)).resolves.toBeUndefined();
    });

    it('rejects unauthenticated secured methods', async () => {
        await expect(guard.checkAuthentication({ securedMethod: true, authenticated: false } as any)).rejects.toBeInstanceOf(AuthenticationError);
    });
});
