import { AuthorizationDecision } from '../../types/authorization-policy';

/**
 * A base class for Security errors.
 */
export class SecurityError extends Error {
    public constructor(
        public readonly response: string,
        public readonly status: number,
        public readonly options?: { cause?: unknown; description?: string }
    ) {
        super(response);
        this.name = this.constructor.name;
    }
}

export class AuthenticationError extends SecurityError {
    public constructor(response: string, options?: { cause?: unknown; description?: string }) {
        super(response, 1, options);
    }
}

export class AuthorizationError extends SecurityError {
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
