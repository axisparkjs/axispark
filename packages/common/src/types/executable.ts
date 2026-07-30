export interface Executable {
    execute(...args: unknown[]): any | Promise<any>;
}
