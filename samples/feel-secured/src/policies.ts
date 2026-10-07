import { AuthorizationDecision, AuthorizationPolicy, SecurityContext } from '@axisparkjs/security';
import { HttpContext } from '@axisparkjs/http';
import { Injectable } from '@axisparkjs/di';
import { Principal } from './authenticator';

@Injectable()
export class AdminPolicy extends AuthorizationPolicy {
    async authorize(context: SecurityContext<Principal>): Promise<AuthorizationDecision> {
        const authorized = context.data?.role === 'admin';
        return authorized ? { policy: AdminPolicy, authorized: true } : { policy: AdminPolicy, authorized: false, reason: 'An administrator role is required' };
    }
}

@Injectable()
export class ActivePrincipalPolicy extends AuthorizationPolicy {
    async authorize(context: SecurityContext<Principal>): Promise<AuthorizationDecision> {
        const authorized = context.data?.active === true;
        return authorized
            ? { policy: ActivePrincipalPolicy, authorized: true }
            : { policy: ActivePrincipalPolicy, authorized: false, reason: 'An active principal is required' };
    }
}

@Injectable()
export class DocumentOwnerPolicy extends AuthorizationPolicy {
    async authorize(context: SecurityContext<Principal>): Promise<AuthorizationDecision> {
        const ownerId = (context as unknown as HttpContext).request.params.ownerId;
        const authorized = context.data?.role === 'admin' || context.data?.id === ownerId;
        return authorized
            ? { policy: DocumentOwnerPolicy, authorized: true }
            : { policy: DocumentOwnerPolicy, authorized: false, reason: 'Only the document owner or an administrator can read it' };
    }
}
