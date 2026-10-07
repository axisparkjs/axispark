import { Middleware, ExecutionTransport, ExecutionContext, Handle, Context, StepPriority } from '@axisparkjs/engine';
import { AuthenticationEngine } from '../../engine/authentication-engine';
import { SecurityPluginOptions } from '../../plugin';
import { SECURITY_OPTIONS } from '../../di';
import { Inject } from '@axisparkjs/di';
import { SecurityContext } from '../../types';

/**
 * Global middleware that invokes the authentication engine for enabled
 * transports. Credential parsing and validation remain the responsibility of
 * the application's authenticator implementations.
 */
@Middleware({ transport: ExecutionTransport.All, global: true, priority: StepPriority.Normal })
export class AuthenticationMiddleware {
    /**
     * @param securityOptions Effective plugin options, including the transports
     * on which authentication should run.
     * @param authenticationEngine Engine that resolves and runs authenticators.
     */
    constructor(
        @Inject(SECURITY_OPTIONS) private readonly securityOptions: SecurityPluginOptions,
        private readonly authenticationEngine: AuthenticationEngine
    ) {}

    /** @param context Current transport execution context. */
    @Handle()
    public async authenticate(@Context() context: ExecutionContext) {
        const allowedTransports = this.securityOptions.authenticator?.transports || [ExecutionTransport.All];
        if (allowedTransports.includes(ExecutionTransport.All) || allowedTransports.includes(context.transport)) {
            await this.authenticationEngine.execute(context as SecurityContext);
        }
    }
}
