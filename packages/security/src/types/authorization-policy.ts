import { ClassType } from '@axisparkjs/common';
import { SecurityContext } from './security-context';

/**
 * Result returned by a policy. A denial must include a human-readable reason;
 * successful decisions need only identify the policy and the allow result.
 */
export type AuthorizationDecision =
    /** The policy permits the current execution. */
    | { policy: ClassType<AuthorizationPolicy>; authorized: true }
    /** The policy denies the current execution and explains why. */
    | { policy: ClassType<AuthorizationPolicy>; authorized: false; reason: string };

/**
 * Base class for application-defined authorization rules.
 *
 * A policy receives the full {@link SecurityContext}, including any identity
 * data returned by the successful authenticator. Implementations can enforce
 * roles, permissions, ownership, tenant boundaries, resource state, or any
 * other application rule. Mark implementations injectable so constructor
 * dependencies can be resolved.
 */
export abstract class AuthorizationPolicy {
    /**
     * Evaluates this policy for the current execution.
     *
     * The engine runs policies in class-then-method order and combines them
     * with logical AND: every policy must return `authorized: true`. It keeps
     * evaluating after a denial so the complete decision list is available to
     * error handlers.
     *
     * @param securityContext Current execution, authenticated identity data,
     * and accumulated security state.
     * @returns Decision identifying this policy and whether it allows access.
     */
    abstract authorize(securityContext: SecurityContext): Promise<AuthorizationDecision>;
}
