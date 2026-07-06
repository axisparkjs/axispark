import { LogLevel } from './log-level';

export interface LogEntry {
    readonly timestamp: Date;
    readonly level: LogLevel;
    readonly message: string;
    readonly scopes: readonly string[];
    readonly error?: Error;
    readonly metadata?: Record<string, unknown>;
}
