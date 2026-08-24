import { Token, TokenUtils } from '../token';

/**
 * Represents an error that occurs when no scoped container is provided for a given token.
 */
export class ScopedContainerNotProvidedError extends Error {
    constructor(token: Token) {
        super(`No scoped container provided for '${TokenUtils.getName(token)}'.`);
    }
}
