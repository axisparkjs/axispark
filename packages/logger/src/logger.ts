import { Injectable } from '@axisparkjs/di';
import { LogData } from './log-data';
import { LogEntry } from './log-entry';
import { LogLevel } from './log-level';
import { LogTransport } from './log-transport';

/**
 * A class for handling logging operations with support for multiple transports and scoping.
 */
@Injectable()
export class Logger {
    /** 
     * Constructor for the Logger class. 
     * @param transports An array of LogTransport instances that define how log entries are handled (e.g., written to console, file, etc.).
     * @param scopes An optional array of strings representing the scopes or contexts for the logger, allowing for hierarchical logging.
    */
    constructor(
        private readonly transports: LogTransport[],
        private readonly scopes: string[] = []
    ) {}

    /** Logs an info message. */
    async info(message: string) {
        await this.log({ level: LogLevel.Info, message });
    }

    /** Logs a warning message. */
    async warn(message: string) {
        await this.log({ level: LogLevel.Warn, message });
    }

    /** Logs an error message. */
    async error(message: string, error?: Error) {
        await this.log({
            level: LogLevel.Error,
            message,
            error
        });
    }

    /** Logs a debug message. */
    async debug(message: string) {
        await this.log({ level: LogLevel.Debug, message });
    }

    /** Logs a trace message. */
    async trace(message: string) {
        await this.log({ level: LogLevel.Trace, message });
    }

    /** Logs a fatal message. */
    async fatal(message: string, error?: Error) {
        await this.log({
            level: LogLevel.Fatal,
            message,
            error
        });
    }

    /** Creates a child logger with an additional scope. */
    public child(scope: string): Logger {
        return new Logger(this.transports, [...this.scopes, scope]);
    }

    /** Internal method to log data using the configured transports. */
    public async log(data: LogData) {
        const entry: LogEntry = {
            timestamp: new Date(),
            level: data.level,
            message: data.message,
            scopes: this.scopes,
            error: data.error,
            metadata: data.metadata
        };

        await Promise.all(this.transports.map((t) => t.write(entry)));
    }
}
