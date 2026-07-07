import { LogLevel } from './log-level';

export interface LogData {
    level: LogLevel;
    message: string;
    error?: Error;
    metadata?: Record<string, unknown>;
}
