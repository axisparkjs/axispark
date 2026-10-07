import { Guard, ExecutionTransport, Check, Context, StepPriority } from '@axisparkjs/engine';
import { SecurityContext } from '../../types';
import { AuthenticationError } from '../errors';

@Guard({ transport: ExecutionTransport.All, global: true, priority: StepPriority.Normal })
export class AuthenticationGuard {
    @Check()
    public async checkAuthentication(@Context() context: SecurityContext) {
        if (context.securedMethod && !context.authenticated)
            throw new AuthenticationError('Unauthenticated', {
                description: 'Request is not authenticated',
                cause: 'No valid authentication found for a secured method'
            });
    }
}
