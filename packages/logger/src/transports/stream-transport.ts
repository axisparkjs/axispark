import { Writable } from 'node:stream';
import { LogEntry } from '../log-entry';
import { LogTransport, LogTransportOptions } from '../log-transport';

export interface StreamTransportOptions extends LogTransportOptions {
    stream: Writable;
}

export class StreamTransport extends LogTransport {
    constructor(private readonly options: StreamTransportOptions) {
        super(options);
    }

    async write(entry: LogEntry): Promise<void> {
        if (entry.level < this.options.minLevel) return;

        this.options.stream.write(this.options.formatter.format(entry) + '\n');
    }
}
