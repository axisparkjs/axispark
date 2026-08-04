import { MemoryTransport } from './memory-transport';
import { LogEntry } from '../log-entry';
import { LogFormatter } from '../log-formatter';
import { LogLevel } from '../log-level';

describe('MemoryTransport', () => {
    let transport: MemoryTransport;

    const createEntry = (level: LogLevel): LogEntry => ({
        timestamp: new Date(),
        level,
        message: 'Test',
        scopes: []
    });

    beforeEach(() => {
        transport = new MemoryTransport({
            formatter: {} as LogFormatter,
            minLevel: LogLevel.Info
        });
    });

    it('should store entries', async () => {
        const entry = createEntry(LogLevel.Info);

        await transport.write(entry);

        expect(transport.entries).toEqual([entry]);
    });

    it('should ignore entries below minLevel', async () => {
        const entry = createEntry(LogLevel.Debug);

        await transport.write(entry);

        expect(transport.entries).toHaveLength(0);
    });

    it('should clear all entries', async () => {
        await transport.write(createEntry(LogLevel.Info));
        await transport.write(createEntry(LogLevel.Error));

        transport.clear();

        expect(transport.entries).toEqual([]);
    });
});
