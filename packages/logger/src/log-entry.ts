import { LogLevel } from './log-level';

/**
 * Defines the structure of a log entry, including its timestamp, level, message, scopes, optional error, and optional metadata.
 */
export interface LogEntry {
    readonly timestamp: Date;
    readonly level: LogLevel;
    readonly message: string;
    readonly scopes: readonly string[];
    readonly error?: Error;
    readonly metadata?: Record<string, unknown>;
}
