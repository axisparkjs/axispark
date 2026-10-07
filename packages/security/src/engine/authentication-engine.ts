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

@Injectable()
export class AuthenticationEngine implements Executable {
    constructor(
        @Inject(SECURITY_OPTIONS) private readonly securityOptions: SecurityPluginOptions,
        private readonly injector: Injector
    ) {}

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
