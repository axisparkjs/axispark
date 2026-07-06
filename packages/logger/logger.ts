import { Injectable } from '@axisparkjs/common';
import { LogData } from './log-data';
import { LogEntry } from './log-entry';
import { LogLevel } from './log-level';
import { LogTransport } from './log-transport';

@Injectable()
export class Logger {
    constructor(
        private readonly transports: LogTransport[],
        private readonly scopes: string[] = []
    ) {}

    async info(message: string) {
        await this.log({ level: LogLevel.INFO, message });
    }

    async warn(message: string) {
        await this.log({ level: LogLevel.WARN, message });
    }

    async error(message: string, error?: Error) {
        await this.log({
            level: LogLevel.ERROR,
            message,
            error
        });
    }

    async debug(message: string) {
        await this.log({ level: LogLevel.DEBUG, message });
    }

    async trace(message: string) {
        await this.log({ level: LogLevel.TRACE, message });
    }

    async fatal(message: string, error?: Error) {
        await this.log({
            level: LogLevel.FATAL,
            message,
            error
        });
    }

    public child(scope: string): Logger {
        return new Logger(this.transports, [...this.scopes, scope]);
    }

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
