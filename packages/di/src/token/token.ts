import { Constructor } from '../types/constructor';

export class InjectionToken {
    constructor(public readonly description: string) {}

    toString() {
        return this.description;
    }
}

export type Token<T = unknown> = Constructor<T> | InjectionToken;

export class TokenUtilsStatic {
    getName(token: Token): string {
        if (token instanceof InjectionToken) {
            return token.description;
        }
        return token.name;
    }
}
export const TokenUtils = new TokenUtilsStatic();
