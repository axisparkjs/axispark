/**
 * An interface representing an object that can be processed. It defines a `process` method that can be called to perform some processing logic. The `process` method can accept any number of arguments of unknown types and can return any type of value.
 */
export interface Processable {
    process(...args: unknown[]): any;
}
