import { LogEntry } from '../log-entry';
import { LogFormatter } from '../log-formatter';
import { LogLevel } from '../log-level';

export class SimpleFormatter implements LogFormatter {
    format(entry: LogEntry): string {
        const scope = entry.scopes.length ? `[${entry.scopes.join(' > ')}] ` : '';

        return `[${entry.timestamp.toISOString()}] ${LogLevel[entry.level]} ${scope}${entry.message}`;
    }
}
