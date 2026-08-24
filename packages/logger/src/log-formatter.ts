import { LogEntry } from './log-entry';

/**
 * An interface for defining log formatting behavior.
 */
export interface LogFormatter {
    format(entry: LogEntry): string;
}
