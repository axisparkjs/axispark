import { LogEntry } from './log-entry';
import { LogFormatter } from './log-formatter';
import { LogLevel } from './log-level';

/**
 * Options for configuring a log transport.
 */
export interface LogTransportOptions {
    /** The formatter to use for processing log entries. */
    formatter: LogFormatter;

    /** The minimum log level to process. */
    minLevel: LogLevel;
}

/**
 * An abstract class for defining log transport behavior.
 */
export abstract class LogTransport {
    /** The configuration options for the log transport. */
    constructor(protected readonly config: LogTransportOptions) {}

    /** Writes a log entry using the configured formatter and minimum level. */
    abstract write(entry: LogEntry): Promise<void>;
}
