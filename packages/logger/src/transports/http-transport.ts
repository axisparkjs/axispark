import { LogEntry } from '../log-entry';
import { LogTransport, LogTransportOptions } from '../log-transport';

/**
 * Options for configuring an HTTP log transport.
 */
export interface HttpTransportOptions extends LogTransportOptions {
    /** The URL to which log entries will be sent via HTTP POST requests. */
    url: string;
    /** Optional headers to include in the HTTP requests. */
    headers?: Record<string, string>;
}

/**
 * A log transport that outputs log entries via HTTP POST requests.
 */
export class HttpTransport extends LogTransport {
    constructor(private readonly options: HttpTransportOptions) {
        super(options);
    }

    async write(entry: LogEntry): Promise<void> {
        if (entry.level < this.options.minLevel) return;

        await fetch(this.options.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...this.options.headers
            },
            body: JSON.stringify(entry)
        });
    }
}
