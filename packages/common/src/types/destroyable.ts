/**
 * An interface representing an object that can be destroyed. It defines a `destroy` method that can be called to perform cleanup or release resources. The `destroy` method can return either `void` or a `Promise<void>`, allowing for both synchronous and asynchronous cleanup operations.
 */
export interface Destroyable {
    destroy(...args: unknown[]): void | Promise<void>;
}
