/**
 * An interface representing a runnable object. It defines a `run` method that can be called to perform some action or operation. The `run` method can accept any number of arguments of unknown types and can return either `void` or a `Promise<void>`, allowing for both synchronous and asynchronous execution.
 */
export interface Runnable {
    run(...args: unknown[]): void | Promise<void>;
}
