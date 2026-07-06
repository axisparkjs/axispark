import { LogEntry } from '../log-entry';
import { LogTransport } from '../log-transport';

export class ConsoleTransport extends LogTransport {
    async write(entry: LogEntry): Promise<void> {
        if (entry.level < this.config.minLevel) return;

        console.log(this.config.formatter.format(entry));
    }
}
