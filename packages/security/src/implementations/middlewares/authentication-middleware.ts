import { Middleware, ExecutionTransport, ExecutionContext, Handle, Context, StepPriority } from '@axisparkjs/engine';
import { AuthenticationEngine } from '../../engine/authentication-engine';
import { SecurityPluginOptions } from '../../plugin';
import { SECURITY_OPTIONS } from '../../di';
import { Inject } from '@axisparkjs/di';
import { SecurityContext } from '../../types';

@Middleware({ transport: ExecutionTransport.All, global: true, priority: StepPriority.Normal })
export class AuthenticationMiddleware {
    constructor(
        @Inject(SECURITY_OPTIONS) private readonly securityOptions: SecurityPluginOptions,
        private readonly authenticationEngine: AuthenticationEngine
    ) {}

    @Handle()
    public async authenticate(@Context() context: ExecutionContext) {
        const allowedTransports = this.securityOptions.authenticator?.transports || [ExecutionTransport.All];
        if (allowedTransports.includes(ExecutionTransport.All) || allowedTransports.includes(context.transport)) {
            await this.authenticationEngine.execute(context as SecurityContext);
        }
    }
}
