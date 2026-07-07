export interface Factory<T> {
    create(...args: unknown[]): T;
}
