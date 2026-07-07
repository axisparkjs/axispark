import { ConsoleTransport } from './console-transport';
import { LogLevel } from '../log-level';
import { LogEntry } from '../log-entry';
import { LogFormatter } from '../log-formatter';

describe('ConsoleTransport', () => {
    let formatter: jest.Mocked<LogFormatter>;
    let transport: ConsoleTransport;

    beforeEach(() => {
        formatter = {
            format: jest.fn().mockReturnValue('formatted message')
        };

        transport = new ConsoleTransport({
            minLevel: LogLevel.INFO,
            formatter
        });

        jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should write the formatted message when level is equal to minLevel', async () => {
        const entry: LogEntry = {
            timestamp: new Date(),
            level: LogLevel.INFO,
            message: 'Test',
            scopes: []
        };

        await transport.write(entry);

        expect(formatter.format).toHaveBeenCalledWith(entry);
        expect(console.log).toHaveBeenCalledWith('formatted message');
    });

    it('should write the formatted message when level is greater than minLevel', async () => {
        const entry: LogEntry = {
            timestamp: new Date(),
            level: LogLevel.ERROR,
            message: 'Test',
            scopes: []
        };

        await transport.write(entry);

        expect(formatter.format).toHaveBeenCalledWith(entry);
        expect(console.log).toHaveBeenCalledWith('formatted message');
    });

    it('should not write anything when level is lower than minLevel', async () => {
        const entry: LogEntry = {
            timestamp: new Date(),
            level: LogLevel.DEBUG,
            message: 'Test',
            scopes: []
        };

        await transport.write(entry);

        expect(formatter.format).not.toHaveBeenCalled();
        expect(console.log).not.toHaveBeenCalled();
    });
});
