export interface Generator<T> {
    generate(...args: unknown[]): T;
}
