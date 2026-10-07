import { Guard, ExecutionTransport, Check, Context, StepPriority } from '@axisparkjs/engine';
import { SecurityContext } from '../../types';
import { AuthenticationError } from '../errors';

/**
 * Global guard that rejects unauthenticated executions marked with
 * `@Secured()` metadata. Public executions are allowed through this guard.
 *
 * Its normal priority makes it run before the authorization guard, so callers
 * receive an authentication failure before an authorization failure.
 */
@Guard({ transport: ExecutionTransport.All, global: true, priority: StepPriority.Normal })
export class AuthenticationGuard {
    /** @param context Security state produced for the current execution. */
    @Check()
    public async checkAuthentication(@Context() context: SecurityContext) {
        if (context.securedMethod && !context.authenticated)
            throw new AuthenticationError('Unauthenticated', {
                description: 'Request is not authenticated',
                cause: 'No valid authentication found for a secured method'
            });
    }
}
