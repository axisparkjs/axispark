/**
 * An interface representing an object that can be initialized. It defines an `init` method that can be called to perform initialization logic. The `init` method can return either `void` or a `Promise<void>`, allowing for both synchronous and asynchronous initialization operations.
 */
export interface Initializable {
    init(...args: unknown[]): void | Promise<void>;
}
