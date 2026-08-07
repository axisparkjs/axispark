import { Token, TokenUtils } from '../token';

export class ScopedContainerNotProvidedError extends Error {
    constructor(token: Token) {
        super(`No scoped container provided for '${TokenUtils.getName(token)}'.`);
    }
}
