import { appendFile } from 'node:fs/promises';

import { DailyFileTransport } from './daily-file-transport';
import { LogLevel } from '../log-level';

jest.mock('node:fs/promises', () => ({
    appendFile: jest.fn()
}));

describe('DailyFileTransport', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2026-07-28T10:00:00Z'));
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.clearAllMocks();
    });

    it('should write into the daily file', async () => {
        const formatter = {
            format: jest.fn().mockReturnValue('formatted')
        };

        const transport = new DailyFileTransport({
            file: 'logs/app.log',
            formatter,
            minLevel: LogLevel.DEBUG
        });

        await transport.write({
            timestamp: new Date(),
            level: LogLevel.INFO,
            message: '',
            scopes: []
        });

        expect(appendFile).toHaveBeenCalledWith('logs/app-2026-07-28.log', 'formatted\n');
    });
});
