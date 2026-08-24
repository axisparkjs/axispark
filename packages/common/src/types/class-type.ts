/**
 * A type representing a class constructor that can create instances of type T.
 * @template T - The type of the instances created by the class constructor. Defaults to unknown.
 */
export type ClassType<T = unknown> = new (...args: any[]) => T;
