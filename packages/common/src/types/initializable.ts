export interface Initializable {
    init(...args: unknown[]): Promise<void>;
}
