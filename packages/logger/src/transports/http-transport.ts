import { LogEntry } from '../log-entry';
import { LogTransport, LogTransportOptions } from '../log-transport';

export interface HttpTransportOptions extends LogTransportOptions {
    url: string;
    headers?: Record<string, string>;
}

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
