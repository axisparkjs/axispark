export interface Factory<T> {
    create(...args: unknown[]): T | Promise<T>;
}
