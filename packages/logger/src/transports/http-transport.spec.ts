import { HttpTransport } from './http-transport';
import { LogEntry } from '../log-entry';
import { LogFormatter } from '../log-formatter';
import { LogLevel } from '../log-level';

describe('HttpTransport', () => {
    let formatter: jest.Mocked<LogFormatter>;
    let transport: HttpTransport;

    const createEntry = (level: LogLevel): LogEntry => ({
        timestamp: new Date(),
        level,
        message: 'Test',
        scopes: []
    });

    beforeEach(() => {
        formatter = {
            format: jest.fn()
        };

        transport = new HttpTransport({
            url: 'https://example.com/logs',
            formatter,
            minLevel: LogLevel.INFO
        });

        global.fetch = jest.fn().mockResolvedValue({} as Response);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should send the log entry', async () => {
        const entry = createEntry(LogLevel.INFO);

        await transport.write(entry);

        expect(fetch).toHaveBeenCalledWith('https://example.com/logs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entry)
        });

        expect(formatter.format).not.toHaveBeenCalled();
    });

    it('should include custom headers', async () => {
        transport = new HttpTransport({
            url: 'https://example.com/logs',
            formatter,
            minLevel: LogLevel.INFO,
            headers: {
                Authorization: 'Bearer token'
            }
        });

        await transport.write(createEntry(LogLevel.INFO));

        expect(fetch).toHaveBeenCalledWith(
            'https://example.com/logs',
            expect.objectContaining({
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer token'
                }
            })
        );
    });

    it('should not send logs below minLevel', async () => {
        await transport.write(createEntry(LogLevel.DEBUG));

        expect(fetch).not.toHaveBeenCalled();
    });
});
