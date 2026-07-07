export interface Runnable {
    run(...args: unknown[]): Promise<void>;
}
