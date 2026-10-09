import { Guard, ExecutionTransport, Check, Context, StepPriority } from '@axisparkjs/engine';
import { SecurityContext } from '../../types';
import { AuthorizationError } from '../errors';

/**
 * Global guard that rejects secured executions denied by one or more policies.
 * Public executions and secured executions with no denying policies continue.
 * It runs after {@link AuthenticationGuard} due to its lower priority.
 */
@Guard({ transport: ExecutionTransport.All, global: true, priority: StepPriority.Low })
export class AuthorizationGuard {
    /** @param context Security state and policy decisions for this execution. */
    @Check()
    public async checkAuthorization(@Context() context: SecurityContext) {
        if (context.securedMethod && !context.authorized) {
            throw new AuthorizationError('Unauthorized', context.authorizationDecisions, 'Request is not authorized');
        }
    }
}
