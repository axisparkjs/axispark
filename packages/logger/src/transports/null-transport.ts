import { LogEntry } from '../log-entry';
import { LogTransport } from '../log-transport';

/**
 * A log transport that discards all log entries.
 */
export class NullTransport extends LogTransport {
    async write(_: LogEntry): Promise<void> {
        /* empty */
    }
}
