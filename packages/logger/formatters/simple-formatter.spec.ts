import { SimpleFormatter } from './simple-formatter';
import { LogEntry } from '../log-entry';
import { LogLevel } from '../log-level';

describe('SimpleFormatter', () => {
    let formatter: SimpleFormatter;

    beforeEach(() => {
        formatter = new SimpleFormatter();
    });

    it('should create an instance of SimpleFormatter', () => {
        expect(formatter).toBeInstanceOf(SimpleFormatter);
    });

    it('should format a log entry without scopes', () => {
        const entry: LogEntry = {
            timestamp: new Date('2025-01-01T10:00:00.000Z'),
            level: LogLevel.INFO,
            message: 'Application started',
            scopes: []
        };

        const result = formatter.format(entry);

        expect(result).toBe('[2025-01-01T10:00:00.000Z] INFO Application started');
    });

    it('should format a log entry with one scope', () => {
        const entry: LogEntry = {
            timestamp: new Date('2025-01-01T10:00:00.000Z'),
            level: LogLevel.WARN,
            message: 'Low memory',
            scopes: ['Server']
        };

        const result = formatter.format(entry);

        expect(result).toBe('[2025-01-01T10:00:00.000Z] WARN [Server] Low memory');
    });

    it('should format a log entry with multiple scopes', () => {
        const entry: LogEntry = {
            timestamp: new Date('2025-01-01T10:00:00.000Z'),
            level: LogLevel.ERROR,
            message: 'Unexpected error',
            scopes: ['API', 'Users', 'Controller']
        };

        const result = formatter.format(entry);

        expect(result).toBe('[2025-01-01T10:00:00.000Z] ERROR [API > Users > Controller] Unexpected error');
    });

    it('should preserve the original log entry', () => {
        const entry: LogEntry = {
            timestamp: new Date('2025-01-01T10:00:00.000Z'),
            level: LogLevel.INFO,
            message: 'Test',
            scopes: ['Scope']
        };

        const original = structuredClone({
            ...entry,
            timestamp: new Date(entry.timestamp)
        });

        formatter.format(entry);

        expect(entry).toEqual(original);
    });
});
