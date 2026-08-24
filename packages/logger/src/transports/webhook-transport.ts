import { LogEntry } from '../log-entry';
import { LogTransport, LogTransportOptions } from '../log-transport';

/**
 * Options for configuring a webhook log transport.
 */
export interface WebhookTransportOptions extends LogTransportOptions {
    /** The URL to which log entries will be sent via HTTP POST requests. */
    url: string;
}

export class WebhookTransport extends LogTransport {
    constructor(private readonly options: WebhookTransportOptions) {
        super(options);
    }

    async write(entry: LogEntry): Promise<void> {
        if (entry.level < this.options.minLevel) return;

        await fetch(this.options.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: this.options.formatter.format(entry)
            })
        });
    }
}
