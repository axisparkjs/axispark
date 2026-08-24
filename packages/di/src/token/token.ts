import { ClassType } from '@axisparkjs/common';

/**
 * A token used for dependency injection.
 */
export class InjectionToken {
    constructor(public readonly description: string) {}

    toString() {
        return this.description;
    }
}

/**
 * A type representing a token used for dependency injection.
 */
export type Token<T = unknown> = ClassType<T> | InjectionToken;

/**
 * A static class for utility methods related to tokens.
 */
export class TokenUtilsStatic {
    /**
     * Retrieves the name of a token.
     * @param token The token for which to retrieve the name.
     * @returns The name of the token.
     */
    getName(token: Token): string {
        if (token instanceof InjectionToken) {
            return token.description;
        }
        return token.name;
    }
}
/**
 * An instance of TokenUtilsStatic that provides utility methods for working with tokens.
 */
export const TokenUtils = new TokenUtilsStatic();
