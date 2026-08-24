/**
 * A utility type that omits properties from a type `T` based on the keys specified in `K`. This type is distributive, meaning it can be applied to union types, resulting in a new type with the specified keys omitted from each member of the union.
 *
 * @template T - The type from which properties will be omitted.
 * @template K - The keys of the properties to omit from type `T`.
 *
 * @example
 * ```typescript
 * type User = { id: number; name: string; email: string };
 * type UserWithoutEmail = DistributiveOmit<User, 'email'>; // Result: { id: number; name: string }
 * ```
 */
export type DistributiveOmit<T, K extends PropertyKey> = T extends any ? Omit<T, K> : never;
