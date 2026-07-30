import { LogEntry } from '../log-entry';
import { LogTransport } from '../log-transport';

export class MemoryTransport extends LogTransport {
    readonly entries: LogEntry[] = [];

    async write(entry: LogEntry): Promise<void> {
        if (entry.level < this.config.minLevel) return;

        this.entries.push(entry);
    }

    clear(): void {
        this.entries.length = 0;
    }
}
