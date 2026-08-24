import { Token, TokenUtils } from '../token';

/**
 * Represents an error that occurs when no provider is found for a given token.
 */
export class ProviderNotFoundError extends Error {
    constructor(token: Token) {
        super(`No provider found for '${TokenUtils.getName(token)}'.`);
    }
}
