import { ClassType } from '@axisparkjs/common';
import { ExecutionContext } from '@axisparkjs/engine';
import { Authenticator } from './authenticator';
import { AuthorizationDecision } from './authorization-policy';

/**
 * Represents the context of a security-related operation.
 */
export interface SecurityContext<T = unknown> extends ExecutionContext {
    securedMethod: boolean;
    authenticated: boolean;
    authenticationMethod?: ClassType<Authenticator>;
    authorized: boolean;
    authorizationDecisions?: AuthorizationDecision[];
    data?: T;
}
