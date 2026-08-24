import { Scanner } from './scanner';

/**
 * A scanner implementation that does not perform any scanning operations. The `NullScanner` class implements the `Scanner` interface and provides a no-op implementation of the `scan` method. This class can be used in scenarios where scanning is not required or desired, effectively disabling scanning functionality.
 * 
 * The `NullScanner` class has a single method, `scan`, which is an asynchronous method that returns a resolved promise without performing any actions. This allows for consistent usage of the `Scanner` interface while avoiding unnecessary scanning operations.
 */
export class NullScanner implements Scanner {
    /**
     * Scans for information or performs scanning operations. In the case of `NullScanner`, this method does not perform any actions and simply returns a resolved promise. This allows for consistent usage of the `Scanner` interface without triggering any scanning behavior.
     */
    public async scan(): Promise<void> {
        /* empty */
    }
}
