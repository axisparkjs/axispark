export interface Runnable {
    run(...args: unknown[]): void | Promise<void>;
}
