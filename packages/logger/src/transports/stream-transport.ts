import { Writable } from 'node:stream';
import { LogEntry } from '../log-entry';
import { LogTransport, LogTransportOptions } from '../log-transport';

/**
 * Options for configuring a stream log transport.
 */
export interface StreamTransportOptions extends LogTransportOptions {
    /** The writable stream to which log entries will be written. */
    stream: Writable;
}

/**
 * A log transport that outputs log entries to a writable stream.
 */
export class StreamTransport extends LogTransport {
    constructor(private readonly options: StreamTransportOptions) {
        super(options);
    }

    async write(entry: LogEntry): Promise<void> {
        if (entry.level < this.options.minLevel) return;

        this.options.stream.write(this.options.formatter.format(entry) + '\n');
    }
}
