import { dirname, extname, basename, join } from 'node:path';

import { LogEntry } from '../log-entry';
import { FileTransport } from './file-transport';

export class DailyFileTransport extends FileTransport {
    protected override getFile(_entry: LogEntry): string {
        const dir = dirname(this.options.file);
        const ext = extname(this.options.file);
        const name = basename(this.options.file, ext);

        const date = new Date().toISOString().slice(0, 10);

        return join(dir, `${name}-${date}${ext}`);
    }
}
