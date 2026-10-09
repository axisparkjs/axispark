import { ClassType } from '@axisparkjs/common';
import { ExecutionContext } from '@axisparkjs/engine';
import { Authenticator } from './authenticator';
import { AuthorizationDecision } from './authorization-policy';

/**
 * Security state carried alongside an AxiSpark execution.
 *
 * Authentication engines write `authenticated`, `authenticationMethod`, and
 * `data`; authorization engines write `authorized` and
 * `authorizationDecisions`. The context extends the transport-neutral
 * {@link ExecutionContext}, so the same authenticator and policy abstractions
 * work across HTTP, messaging, jobs, and other supported transports. The
 * application chooses the shape and meaning of `data`.
 * @template T Shape of the application-defined identity/claims value.
 */
export interface SecurityContext<T = unknown> extends ExecutionContext {
    /** True when the target class or method has `@Secured()` metadata. */
    securedMethod: boolean;
    /** Whether an authenticator has returned a truthy identity value. */
    authenticated: boolean;
    /** Class of the authenticator whose truthy result authenticated this execution. */
    authenticationMethod?: ClassType<Authenticator>;
    /** Whether all configured policies allowed this execution. */
    authorized: boolean;
    /** Decisions returned by each evaluated policy, in evaluation order. */
    authorizationDecisions?: AuthorizationDecision[];
    /** Application-defined identity, principal, or claims returned by an authenticator. */
    data?: T;
}
