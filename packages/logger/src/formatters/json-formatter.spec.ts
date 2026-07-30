import { JsonFormatter } from './json-formatter';
import { LogEntry } from '../log-entry';
import { LogLevel } from '../log-level';

describe('JsonFormatter', () => {
    let formatter: JsonFormatter;

    beforeEach(() => {
        formatter = new JsonFormatter();
    });

    it('should create an instance of JsonFormatter', () => {
        expect(formatter).toBeInstanceOf(JsonFormatter);
    });

    it('should format a basic log entry', () => {
        const entry: LogEntry = {
            timestamp: new Date('2025-01-01T10:00:00.000Z'),
            level: LogLevel.INFO,
            message: 'Application started',
            scopes: []
        };

        expect(JSON.parse(formatter.format(entry))).toEqual({
            timestamp: '2025-01-01T10:00:00.000Z',
            level: 'INFO',
            message: 'Application started',
            scopes: [],
            metadata: undefined,
            error: undefined
        });
    });

    it('should include metadata and error', () => {
        const error = new Error('Something went wrong');

        const entry: LogEntry = {
            timestamp: new Date('2025-01-01T10:00:00.000Z'),
            level: LogLevel.ERROR,
            message: 'Failure',
            scopes: ['API'],
            metadata: {
                id: 1
            },
            error
        };

        expect(JSON.parse(formatter.format(entry))).toEqual({
            timestamp: '2025-01-01T10:00:00.000Z',
            level: 'ERROR',
            message: 'Failure',
            scopes: ['API'],
            metadata: {
                id: 1
            },
            error: {
                name: 'Error',
                message: 'Something went wrong',
                stack: error.stack
            }
        });
    });

    it('should preserve the original log entry', () => {
        const entry: LogEntry = {
            timestamp: new Date('2025-01-01T10:00:00.000Z'),
            level: LogLevel.INFO,
            message: 'Test',
            scopes: []
        };

        const original = structuredClone({
            ...entry,
            timestamp: new Date(entry.timestamp)
        });

        formatter.format(entry);

        expect(entry).toEqual(original);
    });
});
