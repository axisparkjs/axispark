import { Writable } from 'node:stream';

import { StreamTransport } from './stream-transport';
import { LogEntry } from '../log-entry';
import { LogFormatter } from '../log-formatter';
import { LogLevel } from '../log-level';

describe('StreamTransport', () => {
    let formatter: jest.Mocked<LogFormatter>;
    let stream: jest.Mocked<Writable>;
    let transport: StreamTransport;

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

        stream = {
            write: jest.fn()
        } as unknown as jest.Mocked<Writable>;

        transport = new StreamTransport({
            formatter,
            minLevel: LogLevel.INFO,
            stream
        });
    });

    it('should write formatted message to stream', async () => {
        const entry = createEntry(LogLevel.INFO);

        await transport.write(entry);

        expect(formatter.format).toHaveBeenCalledWith(entry);
        expect(stream.write).toHaveBeenCalledWith('formatted\n');
    });

    it('should ignore entries below minLevel', async () => {
        await transport.write(createEntry(LogLevel.DEBUG));

        expect(formatter.format).not.toHaveBeenCalled();
        expect(stream.write).not.toHaveBeenCalled();
    });
});
