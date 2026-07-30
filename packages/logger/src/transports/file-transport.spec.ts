import { appendFile } from 'node:fs/promises';

import { FileTransport } from './file-transport';
import { LogFormatter } from '../log-formatter';
import { LogLevel } from '../log-level';
import { LogEntry } from '../log-entry';

jest.mock('node:fs/promises', () => ({
    appendFile: jest.fn()
}));

describe('FileTransport', () => {
    let formatter: jest.Mocked<LogFormatter>;
    let transport: FileTransport;

    const createEntry = (level: LogLevel): LogEntry => ({
        timestamp: new Date(),
        level,
        message: 'Test',
        scopes: []
    });

    beforeEach(() => {
        formatter = {
            format: jest.fn().mockReturnValue('formatted')
        };

        transport = new FileTransport({
            file: 'app.log',
            formatter,
            minLevel: LogLevel.INFO
        });

        jest.clearAllMocks();
    });

    it('should append the formatted message', async () => {
        const entry = createEntry(LogLevel.INFO);

        await transport.write(entry);

        expect(formatter.format).toHaveBeenCalledWith(entry);

        expect(appendFile).toHaveBeenCalledWith('app.log', 'formatted\n');
    });

    it('should ignore entries below minLevel', async () => {
        await transport.write(createEntry(LogLevel.DEBUG));

        expect(formatter.format).not.toHaveBeenCalled();
        expect(appendFile).not.toHaveBeenCalled();
    });
});
