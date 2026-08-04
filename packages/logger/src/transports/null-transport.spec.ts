import { NullTransport } from './null-transport';
import { LogEntry } from '../log-entry';
import { LogFormatter } from '../log-formatter';
import { LogLevel } from '../log-level';

describe('NullTransport', () => {
    let transport: NullTransport;

    beforeEach(() => {
        transport = new NullTransport({
            formatter: {} as LogFormatter,
            minLevel: LogLevel.Info
        });
    });

    it('should resolve without throwing', async () => {
        const entry: LogEntry = {
            timestamp: new Date(),
            level: LogLevel.Error,
            message: 'Test',
            scopes: []
        };

        await expect(transport.write(entry)).resolves.not.toThrow();
    });
});
