import { Middleware, ExecutionTransport, ExecutionContext, Handle, Context, StepPriority } from '@axisparkjs/engine';
import { AuthorizationEngine } from '../../engine/authorization-engine';
import { SecurityContext } from '../../types';

/**
 * Global middleware that evaluates authorization policies after authentication
 * middleware has populated the security context.
 */
@Middleware({ transport: ExecutionTransport.All, global: true, priority: StepPriority.Low })
export class AuthorizationMiddleware {
    /** @param authorizationEngine Engine that evaluates the policies attached to the target. */
    constructor(private readonly authorizationEngine: AuthorizationEngine) {}

    /** @param context Current transport execution context. */
    @Handle()
    public async authenticate(@Context() context: ExecutionContext) {
        await this.authorizationEngine.execute(context as SecurityContext);
    }
}
