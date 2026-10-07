import { Executable } from '@axisparkjs/common';
import { Injectable, Injector } from '@axisparkjs/di';
import { MetadataKeys } from '@axisparkjs/common';
import { SecurityContext } from '../types';
import { Metadata } from '@axisparkjs/common';
import { SecuredMetadata } from '../metadata/secured-metadata';
import { AuthorizationPolicy } from '../types/authorization-policy';

/**
 * Evaluates the policies attached to a secured class and/or method.
 *
 * Class policies run first, followed by method policies. Every policy is
 * resolved through dependency injection and evaluated in sequence. The engine
 * records every decision and sets `context.authorized` to false if any policy
 * denies access; it does not stop after the first denial. With no policies,
 * the context is marked authorized, while `@Secured()` can still require the
 * authentication guard to find an authenticated identity.
 */
@Injectable()
export class AuthorizationEngine implements Executable {
    /** @param injector Container used to resolve policy instances and their dependencies. */
    constructor(private readonly injector: Injector) {}

    /**
     * Evaluates and stores all class-level and method-level policy decisions.
     *
     * @param context Execution context enriched with authentication data and
     * authorization state.
     */
    async execute(context: SecurityContext): Promise<void> {
        context.authorizationDecisions = [];
        context.authorized = true;
        const securedMetadataClass = Metadata.get<SecuredMetadata>(MetadataKeys.SECURED, context.target);
        const securedMetadata = Metadata.get<SecuredMetadata>(MetadataKeys.SECURED, context.target, context.propertyKey) as SecuredMetadata;
        const classPolicies = securedMetadataClass?.policies || [];
        let policies = securedMetadata?.policies || [];
        policies = [...classPolicies, ...policies];

        for (const policyClass of policies) {
            const policyInstance = await this.injector.get<AuthorizationPolicy>(policyClass);
            const authorizationDecision = await policyInstance.authorize(context);
            context.authorizationDecisions.push(authorizationDecision);
            if (!authorizationDecision.authorized) context.authorized = false;
        }
    }
}
