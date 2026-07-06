import { LogEntry } from './log-entry';
import { LogFormatter } from './log-formatter';
import { LogLevel } from './log-level';

export interface LogTransportOptions {
    formatter: LogFormatter;
    minLevel: LogLevel;
}

export abstract class LogTransport {
    constructor(protected readonly config: LogTransportOptions) {}

    abstract write(entry: LogEntry): Promise<void>;
}
