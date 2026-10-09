import { Executable } from '@axisparkjs/common';
import { ClassRegistry, Inject, Injectable, Injector } from '@axisparkjs/di';
import { SecurityPluginOptions } from '../plugin';
import { SECURITY_OPTIONS } from '../di';
import { SecurityContext } from '../types/security-context';
import { MetadataKeys } from '@axisparkjs/common';
import { Authenticator, AuthenticatorType } from '../types';
import { ExecutionTransport } from '@axisparkjs/engine';
import { Metadata } from '@axisparkjs/common';
import { SecuredMetadata } from '../metadata/secured-metadata';

/**
 * Runs the configured authenticators against an execution context and records
 * the first successful result in its {@link SecurityContext}.
 *
 * The engine also marks the context as secured when it finds `@Secured()`
 * metadata on the target class or method. This lets the guards enforce
 * authentication even when no authorization policies are configured.
 *
 * Authentication is attempted in configured order. An authenticator succeeds
 * only when it returns a truthy value; `undefined`, `null`, `false`, `0`, and
 * the empty string are treated as failure. The first truthy value becomes
 * `context.data`, and no later authenticator is called.
 */
@Injectable()
export class AuthenticationEngine implements Executable {
    /**
     * @param securityOptions Effective configuration supplied by the security
     * plugin.
     * @param injector Container used to resolve authenticator instances and
     * their dependencies.
     */
    constructor(
        @Inject(SECURITY_OPTIONS) private readonly securityOptions: SecurityPluginOptions,
        private readonly injector: Injector
    ) {}

    /**
     * Detect whether the target is secured, select compatible authenticators,
     * and authenticate the current execution.
     *
     * `strategy: 'selected'` uses only the classes in `selected`. The `all`
     * strategy discovers injectable classes that extend {@link Authenticator}.
     * A class is considered only when its static `transports` includes the
     * current transport or `ExecutionTransport.All`.
     *
     * @param context Execution context enriched with security state.
     */
    async execute(context: SecurityContext): Promise<void> {
        const authenticatorOptions = this.securityOptions.authenticator;
        const securedMetadataClass = Metadata.get<SecuredMetadata>(MetadataKeys.SECURED, context.target);
        const securedMetadata = Metadata.get<SecuredMetadata>(MetadataKeys.SECURED, context.target, context.propertyKey);
        if (securedMetadataClass !== undefined || securedMetadata !== undefined) {
            context.securedMethod = true;
        }

        const authenticators: AuthenticatorType[] =
            authenticatorOptions?.strategy === 'selected'
                ? authenticatorOptions.selected || []
                : ClassRegistry.getWithMetadata(MetadataKeys.INJECTABLE).filter(
                      (authenticator): authenticator is AuthenticatorType => authenticator.prototype instanceof Authenticator
                  );
        const authenticatorsAllowedByTransport = authenticators.filter(
            (authenticatorClass) => authenticatorClass.transports.includes(context.transport) || authenticatorClass.transports.includes(ExecutionTransport.All)
        );

        for (const authenticatorClass of authenticatorsAllowedByTransport) {
            const authenticatorInstance = await this.injector.get<Authenticator>(authenticatorClass);
            const authenticationData = await authenticatorInstance.authenticate(context);

            if (authenticationData) {
                context.authenticated = true;
                context.data = authenticationData;
                context.authenticationMethod = authenticatorClass;

                return;
            }
        }
    }
}
