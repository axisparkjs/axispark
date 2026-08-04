import { appendFile, rename, stat } from 'node:fs/promises';

import { LogEntry } from '../log-entry';
import { LogFormatter } from '../log-formatter';
import { LogLevel } from '../log-level';
import { RotatingFileTransport } from './rotating-file-transport';

jest.mock('node:fs/promises', () => ({
    appendFile: jest.fn(),
    rename: jest.fn(),
    stat: jest.fn()
}));

describe('RotatingFileTransport', () => {
    let formatter: jest.Mocked<LogFormatter>;
    let transport: RotatingFileTransport;

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

        transport = new RotatingFileTransport({
            file: 'logs/app.log',
            formatter,
            minLevel: LogLevel.Info,
            maxSize: 1024,
            maxFiles: 3
        });

        jest.clearAllMocks();
    });

    it('should write without rotating when file does not exist', async () => {
        (stat as jest.Mock).mockRejectedValue(new Error());

        await transport.write(createEntry(LogLevel.Info));

        expect(rename).not.toHaveBeenCalled();

        expect(appendFile).toHaveBeenCalledWith('logs/app.log', 'formatted\n');
    });

    it('should write without rotating when file size is below maxSize', async () => {
        (stat as jest.Mock).mockResolvedValue({
            size: 100
        });

        await transport.write(createEntry(LogLevel.Info));

        expect(rename).not.toHaveBeenCalled();

        expect(appendFile).toHaveBeenCalledWith('logs/app.log', 'formatted\n');
    });

    it('should rotate files when maxSize is exceeded', async () => {
        (stat as jest.Mock).mockResolvedValue({
            size: 2048
        });

        (rename as jest.Mock).mockResolvedValue(undefined);

        await transport.write(createEntry(LogLevel.Info));

        expect(rename).toHaveBeenNthCalledWith(1, 'logs/app.2.log', 'logs/app.3.log');

        expect(rename).toHaveBeenNthCalledWith(2, 'logs/app.1.log', 'logs/app.2.log');

        expect(rename).toHaveBeenNthCalledWith(3, 'logs/app.log', 'logs/app.1.log');

        expect(appendFile).toHaveBeenCalledWith('logs/app.log', 'formatted\n');
    });

    it('should ignore rename errors', async () => {
        (stat as jest.Mock).mockResolvedValue({
            size: 2048
        });

        (rename as jest.Mock).mockRejectedValue(new Error());

        await expect(transport.write(createEntry(LogLevel.Info))).resolves.not.toThrow();

        expect(appendFile).toHaveBeenCalledWith('logs/app.log', 'formatted\n');
    });

    it('should respect maxFiles option', async () => {
        transport = new RotatingFileTransport({
            file: 'logs/app.log',
            formatter,
            minLevel: LogLevel.Info,
            maxSize: 1024,
            maxFiles: 5
        });

        (stat as jest.Mock).mockResolvedValue({
            size: 2048
        });

        await transport.write(createEntry(LogLevel.Info));

        expect(rename).toHaveBeenNthCalledWith(1, 'logs/app.4.log', 'logs/app.5.log');

        expect(rename).toHaveBeenNthCalledWith(2, 'logs/app.3.log', 'logs/app.4.log');

        expect(rename).toHaveBeenNthCalledWith(3, 'logs/app.2.log', 'logs/app.3.log');

        expect(rename).toHaveBeenNthCalledWith(4, 'logs/app.1.log', 'logs/app.2.log');

        expect(rename).toHaveBeenNthCalledWith(5, 'logs/app.log', 'logs/app.1.log');
    });

    it('should not write when level is below minLevel', async () => {
        await transport.write(createEntry(LogLevel.Debug));

        expect(stat).not.toHaveBeenCalled();
        expect(rename).not.toHaveBeenCalled();
        expect(appendFile).not.toHaveBeenCalled();
    });
});
