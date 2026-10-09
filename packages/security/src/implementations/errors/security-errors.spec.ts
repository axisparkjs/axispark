import { AuthorizationError, AuthenticationError, SecurityError } from './security-errors';

describe('security errors', () => {
    it('sets the error name and preserves the supplied response and details', () => {
        const error = new SecurityError('Failure', 500, { cause: 'test', description: 'details' });

        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Failure');
        expect(error.name).toBe('SecurityError');
        expect(error.response).toBe('Failure');
        expect(error.status).toBe(500);
        expect(error.options).toEqual({ cause: 'test', description: 'details' });
    });

    it('creates an authentication error with its status and optional details', () => {
        const withDetails = new AuthenticationError('Unauthenticated', { cause: 'missing', description: 'login required' });
        const withoutDetails = new AuthenticationError('Unauthenticated');

        expect(withDetails.name).toBe('AuthenticationError');
        expect(withDetails.status).toBe(1);
        expect(withDetails.options).toEqual({ cause: 'missing', description: 'login required' });
        expect(withoutDetails.options).toBeUndefined();
    });

    it('creates authorization error causes from decisions', () => {
        const allowedPolicy = class AllowedPolicy {};
        const deniedPolicy = class DeniedPolicy {};
        const decisions: any[] = [
            { policy: allowedPolicy, authorized: true },
            { policy: deniedPolicy, authorized: false, reason: 'not owner' }
        ];
        const error = new AuthorizationError('Forbidden', decisions, 'access denied');

        expect(error.name).toBe('AuthorizationError');
        expect(error.status).toBe(2);
        expect(error.causes).toBe(decisions);
        expect(error.options).toEqual({ description: 'access denied', cause: 'AllowedPolicy. Authorized; DeniedPolicy. not owner' });
    });

    it('uses the fallback cause when authorization has no decisions', () => {
        const error = new AuthorizationError('Forbidden');

        expect(error.options).toEqual({ description: undefined, cause: 'Unknown cause' });
    });
});
