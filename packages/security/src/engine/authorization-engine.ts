import { Executable } from '@axisparkjs/common';
import { Injectable, Injector } from '@axisparkjs/di';
import { MetadataKeys } from '@axisparkjs/common';
import { SecurityContext } from '../types';
import { Metadata } from '@axisparkjs/common';
import { SecuredMetadata } from '../metadata/secured-metadata';
import { AuthorizationPolicy } from '../types/authorization-policy';

@Injectable()
export class AuthorizationEngine implements Executable {
    constructor(private readonly injector: Injector) {}

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
