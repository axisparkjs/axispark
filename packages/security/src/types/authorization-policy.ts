import { ClassType } from '@axisparkjs/common';
import { SecurityContext } from './security-context';

export type AuthorizationDecision =
    | { policy: ClassType<AuthorizationPolicy>; authorized: true }
    | { policy: ClassType<AuthorizationPolicy>; authorized: false; reason: string };

/**
 * Represents an authorization policy that can be used to authorize an execution context based on provided credentials.
 */
export abstract class AuthorizationPolicy {
    /**
     * Authorizes an execution context based on the provided credentials.
     * @param securityContext The security context to authorize.
     * @returns A promise that resolves to an authorization decision indicating whether the execution context is authorized or not.
     */
    abstract authorize(securityContext: SecurityContext): Promise<AuthorizationDecision>;
}
