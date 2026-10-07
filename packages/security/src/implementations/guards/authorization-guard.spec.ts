import { AuthorizationError } from '../errors';
import { AuthorizationGuard } from './authorization-guard';

describe('AuthorizationGuard', () => {
    const guard = new AuthorizationGuard();

    it('allows unprotected methods', async () => {
        await expect(guard.checkAuthorization({ securedMethod: false, authorized: false } as any)).resolves.toBeUndefined();
    });

    it('allows authorized secured methods', async () => {
        await expect(guard.checkAuthorization({ securedMethod: true, authorized: true } as any)).resolves.toBeUndefined();
    });

    it('rejects unauthorized secured methods and includes decisions', async () => {
        const decisions = [{ policy: class DenyPolicy {}, authorized: false as const, reason: 'denied' }];

        await expect(guard.checkAuthorization({ securedMethod: true, authorized: false, authorizationDecisions: decisions } as any)).rejects.toBeInstanceOf(
            AuthorizationError
        );
        await expect(guard.checkAuthorization({ securedMethod: true, authorized: false, authorizationDecisions: decisions } as any)).rejects.toMatchObject({
            causes: decisions
        });
    });
});
