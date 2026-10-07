import { ExecutionContext, ExecutionTransport } from '@axisparkjs/engine';

/**
 * Represents a type of authenticator that can be used to authenticate an execution context based on provided credentials.
 * @template T The type of the authenticator.
 */
export interface AuthenticatorType<T extends Authenticator = Authenticator> {
    new (...args: any[]): T;
    readonly transports: readonly ExecutionTransport[];
}

/**
 * Represents an authenticator that can authenticate a execution context based on provided credentials.
 */
export abstract class Authenticator {
    /**
     * The transports that this authenticator supports. Default is ExecutionTransport.All, which means it can be used with any transport. If you want to restrict the authenticator to specific transports, you can specify them in this array.
     */
    static readonly transports: readonly ExecutionTransport[] = [ExecutionTransport.All];
    /**
     * Authenticates a user based on the provided credentials.
     * @param executionContext The execution context to authenticate.
     * @returns A promise that resolves to the authenticated data or undefined if authentication fails. The authenticated data will be stored in the context for further use.
     */
    abstract authenticate(executionContext: ExecutionContext): Promise<any | undefined>;
}
