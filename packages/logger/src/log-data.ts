import { LogLevel } from './log-level';

/**
 * Defines the structure of log data, including its level, message, optional error, and optional metadata.
 */
export interface LogData {
    level: LogLevel;
    message: string;
    error?: Error;
    metadata?: Record<string, unknown>;
}
