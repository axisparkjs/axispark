import { LogEntry } from '../log-entry';
import { LogTransport } from '../log-transport';

export class NullTransport extends LogTransport {
    async write(_: LogEntry): Promise<void> {
        /* empty */
    }
}
