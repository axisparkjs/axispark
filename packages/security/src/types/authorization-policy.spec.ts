import { AuthorizationDecision, AuthorizationPolicy } from './authorization-policy';

describe('AuthorizationPolicy', () => {
    it('supports application-defined authorization decisions', async () => {
        class OwnPolicy extends AuthorizationPolicy {
            async authorize(_securityContext: any): Promise<AuthorizationDecision> {
                const decision: AuthorizationDecision = { policy: OwnPolicy, authorized: false, reason: 'resource owner mismatch' };
                return decision;
            }
        }
        const policy = new OwnPolicy();

        await expect(policy.authorize({} as any)).resolves.toEqual({
            policy: OwnPolicy,
            authorized: false,
            reason: 'resource owner mismatch'
        });
    });
});
