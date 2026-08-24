/**
 * Represents a scanner that can be used to scan for specific information or perform scanning operations. The `Scanner` interface defines a single method, `scan`, which is responsible for initiating the scanning process. Implementations of this interface can provide their own logic for scanning, which may involve asynchronous operations and return a promise or perform synchronous scanning and return void.
 */
export interface Scanner {
    scan(): Promise<void> | void;
}
