/**
 * An interface representing a factory that can create instances of type T. It defines a `create` method that can be called with any number of arguments of unknown types and returns either an instance of type T or a Promise that resolves to an instance of type T.
 * @template T - The type of the instances created by the factory.
 */
export interface Factory<T> {
    create(...args: unknown[]): T | Promise<T>;
}
