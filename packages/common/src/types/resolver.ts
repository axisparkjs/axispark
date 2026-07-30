export interface Resolver<T> {
    resolve(...args: unknown[]): T;
}
