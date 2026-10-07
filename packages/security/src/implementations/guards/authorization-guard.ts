import { Guard, ExecutionTransport, Check, Context, StepPriority } from '@axisparkjs/engine';
import { SecurityContext } from '../../types';
import { AuthorizationError } from '../errors';

@Guard({ transport: ExecutionTransport.All, global: true, priority: StepPriority.Low })
export class AuthorizationGuard {
    @Check()
    public async checkAuthorization(@Context() context: SecurityContext) {
        if (context.securedMethod && !context.authorized) {
            throw new AuthorizationError('Unauthorized', context.authorizationDecisions, 'Request is not authorized');
        }
    }
}
