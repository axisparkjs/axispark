import { Token, TokenUtils } from '../token';

export class ProviderNotFoundError extends Error {
    constructor(token: Token) {
        super(`No provider found for '${TokenUtils.getName(token)}'.`);
    }
}
