export interface Initializable {
    init(...args: unknown[]): void | Promise<void>;
}
