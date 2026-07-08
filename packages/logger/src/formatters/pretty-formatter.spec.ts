import { PrettyFormatter } from './pretty-formatter';
import { LogEntry } from '../log-entry';
import { LogLevel } from '../log-level';

describe('PrettyFormatter', () => {
    let formatter: PrettyFormatter;

    beforeEach(() => {
        formatter = new PrettyFormatter();
    });

    it('should create an instance of PrettyFormatter', () => {
        expect(formatter).toBeInstanceOf(PrettyFormatter);
    });

    it('should format a log entry without scopes, metadata or error', () => {
        const entry: LogEntry = {
            timestamp: new Date('2025-01-01T10:00:00.000Z'),
            level: LogLevel.INFO,
            message: 'Application started',
            scopes: []
        };

        const result = formatter.format(entry);

        expect(result).toBe(['2025-01-01T10:00:00.000Z │ INFO ', '  Application started'].join('\n'));
    });

    it('should format a log entry with scopes', () => {
        const entry: LogEntry = {
            timestamp: new Date('2025-01-01T10:00:00.000Z'),
            level: LogLevel.WARN,
            message: 'Low memory',
            scopes: ['Server', 'API']
        };

        const result = formatter.format(entry);

        expect(result).toBe(['2025-01-01T10:00:00.000Z │ WARN  │ [Server > API]', '  Low memory'].join('\n'));
    });

    it('should include metadata', () => {
        const entry: LogEntry = {
            timestamp: new Date('2025-01-01T10:00:00.000Z'),
            level: LogLevel.INFO,
            message: 'User created',
            scopes: [],
            metadata: {
                userId: 123,
                username: 'john'
            }
        };

        const result = formatter.format(entry);

        expect(result).toContain('Metadata:');
        expect(result).toContain('"userId": 123');
        expect(result).toContain('"username": "john"');
    });

    it('should include error without stack', () => {
        const error = new Error('Something went wrong');
        error.stack = undefined;

        const entry: LogEntry = {
            timestamp: new Date('2025-01-01T10:00:00.000Z'),
            level: LogLevel.ERROR,
            message: 'Operation failed',
            scopes: [],
            error
        };

        const result = formatter.format(entry);

        expect(result).toContain('Error: Error: Something went wrong');
        expect(result).not.toContain('    Error:');
    });

    it('should include error stack', () => {
        const error = new Error('Something went wrong');
        error.stack = ['Error: Something went wrong', '    at Service.method (service.ts:10:5)', '    at main (main.ts:5:1)'].join('\n');

        const entry: LogEntry = {
            timestamp: new Date('2025-01-01T10:00:00.000Z'),
            level: LogLevel.ERROR,
            message: 'Operation failed',
            scopes: ['API'],
            error
        };

        const result = formatter.format(entry);

        expect(result).toContain('Error: Error: Something went wrong');
        expect(result).toContain('Service.method');
        expect(result).toContain('main.ts');
    });

    it('should include metadata and error together', () => {
        const error = new Error('Boom');
        error.stack = undefined;

        const entry: LogEntry = {
            timestamp: new Date('2025-01-01T10:00:00.000Z'),
            level: LogLevel.ERROR,
            message: 'Request failed',
            scopes: ['HTTP'],
            metadata: {
                method: 'GET',
                path: '/users'
            },
            error
        };

        const result = formatter.format(entry);

        expect(result).toContain('[HTTP]');
        expect(result).toContain('Metadata:');
        expect(result).toContain('"method": "GET"');
        expect(result).toContain('"path": "/users"');
        expect(result).toContain('Error: Error: Boom');
    });

    it('should preserve the original log entry', () => {
        const error = new Error('Boom');

        const entry: LogEntry = {
            timestamp: new Date('2025-01-01T10:00:00.000Z'),
            level: LogLevel.INFO,
            message: 'Test',
            scopes: ['Scope'],
            metadata: {
                key: 'value'
            },
            error
        };

        const original = {
            ...entry,
            timestamp: new Date(entry.timestamp),
            scopes: [...entry.scopes],
            metadata: structuredClone(entry.metadata),
            error
        };

        formatter.format(entry);

        expect(entry).toEqual(original);
    });
});
