export interface Destroyable {
    destroy(...args: unknown[]): Promise<void>;
}
