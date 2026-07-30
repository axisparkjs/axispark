import { XmlFormatter } from './xml-formatter';
import { LogEntry } from '../log-entry';
import { LogLevel } from '../log-level';

describe('XmlFormatter', () => {
    let formatter: XmlFormatter;

    beforeEach(() => {
        formatter = new XmlFormatter();
    });

    it('should create an instance of XmlFormatter', () => {
        expect(formatter).toBeInstanceOf(XmlFormatter);
    });

    it('should format a basic log entry', () => {
        const entry: LogEntry = {
            timestamp: new Date('2025-01-01T10:00:00.000Z'),
            level: LogLevel.INFO,
            message: 'Application started',
            scopes: []
        };

        const result = formatter.format(entry);

        expect(result).toContain('<timestamp>2025-01-01T10:00:00.000Z</timestamp>');
        expect(result).toContain('<level>INFO</level>');
        expect(result).toContain('<message>Application started</message>');
    });

    it('should include scopes, metadata and error', () => {
        const error = new Error('Boom');

        const entry: LogEntry = {
            timestamp: new Date('2025-01-01T10:00:00.000Z'),
            level: LogLevel.ERROR,
            message: 'Failure',
            scopes: ['API', 'Users'],
            metadata: {
                id: 10
            },
            error
        };

        const result = formatter.format(entry);

        expect(result).toContain('<scope>API</scope>');
        expect(result).toContain('<scope>Users</scope>');
        expect(result).toContain('<metadata><![CDATA[{"id":10}]]></metadata>');
        expect(result).toContain('<name>Error</name>');
        expect(result).toContain('<message>Boom</message>');
    });

    it('should escape xml characters', () => {
        const entry: LogEntry = {
            timestamp: new Date(),
            level: LogLevel.INFO,
            message: '<hello> & "world"',
            scopes: ['<scope>']
        };

        const result = formatter.format(entry);

        expect(result).toContain('&lt;hello&gt;');
        expect(result).toContain('&amp;');
        expect(result).toContain('&quot;world&quot;');
        expect(result).toContain('&lt;scope&gt;');
    });

    it('should preserve the original log entry', () => {
        const entry: LogEntry = {
            timestamp: new Date(),
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
