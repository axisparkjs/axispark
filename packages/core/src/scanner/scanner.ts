export interface Scanner {
    scan(): Promise<void> | void;
}
