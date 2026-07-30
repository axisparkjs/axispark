import { appendFile } from 'node:fs/promises';
import { LogEntry } from '../log-entry';
import { LogTransport, LogTransportOptions } from '../log-transport';

export interface FileTransportOptions extends LogTransportOptions {
    file: string;
}

export class FileTransport extends LogTransport {
    constructor(protected readonly options: FileTransportOptions) {
        super(options);
    }

    protected getFile(_entry: LogEntry): string {
        return this.options.file;
    }

    protected async beforeWrite(_entry: LogEntry): Promise<void> {
        /* empty */
    }

    async write(entry: LogEntry): Promise<void> {
        if (entry.level < this.options.minLevel) return;

        await this.beforeWrite(entry);

        await appendFile(this.getFile(entry), this.options.formatter.format(entry) + '\n');
    }
}
