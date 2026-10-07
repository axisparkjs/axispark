import { Middleware, ExecutionTransport, ExecutionContext, Handle, Context, StepPriority } from '@axisparkjs/engine';
import { AuthorizationEngine } from '../../engine/authorization-engine';
import { SecurityContext } from '../../types';

@Middleware({ transport: ExecutionTransport.All, global: true, priority: StepPriority.Low })
export class AuthorizationMiddleware {
    constructor(private readonly authorizationEngine: AuthorizationEngine) {}

    @Handle()
    public async authenticate(@Context() context: ExecutionContext) {
        await this.authorizationEngine.execute(context as SecurityContext);
    }
}
