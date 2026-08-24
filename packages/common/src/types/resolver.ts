/**
 * An interface representing a resolver that can resolve a value of type T. It defines a `resolve` method that can be called with any number of arguments of unknown types and returns either a value of type T or a Promise that resolves to a value of type T.
 * @template T - The type of the value resolved by the resolver.
 */
export interface Resolver<T> {
    resolve(...args: unknown[]): T | Promise<T>;
}
