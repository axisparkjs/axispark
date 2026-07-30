export interface Destroyable {
    destroy(...args: unknown[]): void | Promise<void>;
}
