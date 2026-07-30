import { LogEntry } from '../log-entry';
import { LogFormatter } from '../log-formatter';
import { LogLevel } from '../log-level';

export class TemplateFormatter implements LogFormatter {
    constructor(private readonly template: string) {}

    format(entry: LogEntry): string {
        const values: Record<string, string> = {
            timestamp: entry.timestamp.toISOString(),
            level: LogLevel[entry.level],
            message: entry.message,
            scopes: entry.scopes.join(' > '),
            metadata: entry.metadata ? JSON.stringify(entry.metadata) : '',
            error: entry.error ? `${entry.error.name}: ${entry.error.message}` : ''
        };

        return this.template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? '');
    }
}
