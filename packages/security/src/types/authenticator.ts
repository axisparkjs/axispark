import { ExecutionContext, ExecutionTransport } from '@axisparkjs/engine';

/**
 * Constructor type for an {@link Authenticator}, including its transport
 * declaration. The engine uses the static transport list before resolving the
 * class from dependency injection.
 * @template T Concrete authenticator instance type.
 */
export interface AuthenticatorType<T extends Authenticator = Authenticator> {
    new (...args: any[]): T;
    readonly transports: readonly ExecutionTransport[];
}

/**
 * Base class for application-defined credential authenticators.
 *
 * Implementations can read credentials from any part of the transport
 * execution context, validate them with application-specific services, and
 * return any application-defined principal or claims object. The package does
 * not impose a token format, user model, session strategy, or persistence
 * mechanism. Register the implementation as injectable so its dependencies
 * can be resolved.
 */
export abstract class Authenticator {
    /**
     * Transports supported by this authenticator. The default supports every
     * transport. Override it on a subclass to keep transport-specific logic
     * from running for unrelated execution types.
     */
    static readonly transports: readonly ExecutionTransport[] = [ExecutionTransport.All];
    /**
     * Authenticates the current execution using application-defined rules.
     *
     * Return a truthy principal/claims value for success. Return `undefined`
     * (or another falsy value) when the credentials are absent or invalid. The
     * first truthy result from configured authenticators is stored in
     * `SecurityContext.data`, and later authenticators are skipped.
     *
     * @param executionContext Transport-neutral execution data provided by the
     * AxiSpark engine.
     * @returns The application-defined identity data, or a falsy value when
     * this authenticator does not authenticate the execution.
     */
    abstract authenticate(executionContext: ExecutionContext): Promise<any | undefined>;
}
