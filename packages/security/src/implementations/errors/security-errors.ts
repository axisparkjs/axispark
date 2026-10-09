import { AuthorizationDecision } from '../../types/authorization-policy';

/**
 * Base error type emitted by the security pipeline.
 *
 * This package deliberately does not depend on an HTTP response model.
 * Transport adapters or application error filters should translate this error
 * into a protocol-specific response. `status` is a package category code
 * (`1` for authentication and `2` for authorization), not an HTTP status.
 */
export class SecurityError extends Error {
    /**
     * @param response Human-readable error message.
     * @param status Security error category code.
     * @param options Optional cause and a longer description for logging or
     * protocol-specific error mapping.
     */
    public constructor(
        public readonly response: string,
        public readonly status: number,
        public readonly options?: { cause?: unknown; description?: string }
    ) {
        super(response);
        this.name = this.constructor.name;
    }
}

/** Thrown when a secured execution reaches the guard without authentication. */
export class AuthenticationError extends SecurityError {
    /**
     * @param response Human-readable error message.
     * @param options Optional cause and description.
     */
    public constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, 1, options);
    }
}

/**
 * Thrown when at least one policy denies access to a secured execution.
 * The denial decisions are available in {@link causes}.
 */
export class AuthorizationError extends SecurityError {
    /**
     * @param response Human-readable error message.
     * @param causes Policy decisions gathered for the execution. Defaults to an
     * empty list when no decision details are available.
     * @param description Optional longer explanation for logs or error mapping.
     */
    public constructor(
        response: string,
        public readonly causes: AuthorizationDecision[] = [],
        description?: string
    ) {
        const cause =
            causes.map((decision) => `${decision.policy.name}. ${decision.authorized ? 'Authorized' : decision.reason}`).join('; ') || 'Unknown cause';
        super(response, 2, { description, cause });
    }
}
