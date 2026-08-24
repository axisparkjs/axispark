import { LogEntry } from '../log-entry';
import { LogFormatter } from '../log-formatter';
import { LogLevel } from '../log-level';

/**
 * A log formatter that outputs log entries in JSON format.
 */
export class JsonFormatter implements LogFormatter {
    format(entry: LogEntry): string {
        return JSON.stringify({
            timestamp: entry.timestamp.toISOString(),
            level: LogLevel[entry.level].toLocaleUpperCase(),
            message: entry.message,
            scopes: entry.scopes,
            metadata: entry.metadata,
            error: entry.error && {
                name: entry.error.name,
                message: entry.error.message,
                stack: entry.error.stack
            }
        });
    }
}
