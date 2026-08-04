import { TemplateFormatter } from './template-formatter';
import { LogEntry } from '../log-entry';
import { LogLevel } from '../log-level';

describe('TemplateFormatter', () => {
    const entry: LogEntry = {
        timestamp: new Date('2025-01-01T10:00:00.000Z'),
        level: LogLevel.Info,
        message: 'Application started',
        scopes: ['Server'],
        metadata: {
            port: 3000
        }
    };

    const otherEntry: LogEntry = {
        timestamp: new Date('2025-01-01T10:00:00.000Z'),
        level: LogLevel.Info,
        message: 'Application started',
        scopes: ['Server'],
        error: new Error('Failure')
    };

    it('should create an instance of TemplateFormatter', () => {
        expect(new TemplateFormatter('{message}')).toBeInstanceOf(TemplateFormatter);
    });

    it('should replace all placeholders', () => {
        const formatter = new TemplateFormatter('[{timestamp}] {level} [{scopes}] {message}');

        expect(formatter.format(entry)).toBe('[2025-01-01T10:00:00.000Z] INFO [Server] Application started');
    });

    it('should serialize metadata', () => {
        const formatter = new TemplateFormatter('{metadata}');

        expect(formatter.format(entry)).toBe('{"port":3000}');
    });

    it('should replace missing values with an empty string', () => {
        const formatter = new TemplateFormatter('{error}');

        expect(formatter.format(entry)).toBe('');
    });

    it('should format the error placeholder', () => {
        const formatter = new TemplateFormatter('{error}');

        expect(formatter.format(otherEntry)).toBe('Error: Failure');
    });

    it('should handle bad patterns gracefully', () => {
        const formatter = new TemplateFormatter('{message} {unknown}');

        expect(formatter.format(entry)).toBe('Application started ');
    });

    it('should preserve the original log entry', () => {
        const formatter = new TemplateFormatter('{message}');

        const original = structuredClone({
            ...entry,
            timestamp: new Date(entry.timestamp)
        });

        formatter.format(entry);

        expect(entry).toEqual(original);
    });
});
