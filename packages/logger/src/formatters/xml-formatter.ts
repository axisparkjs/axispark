import { LogEntry } from '../log-entry';
import { LogFormatter } from '../log-formatter';
import { LogLevel } from '../log-level';

export class XmlFormatter implements LogFormatter {
    format(entry: LogEntry): string {
        const metadata = entry.metadata ? `<metadata><![CDATA[${JSON.stringify(entry.metadata)}]]></metadata>` : '';

        const error = entry.error
            ? `
    <error>
        <name>${this.escape(entry.error.name)}</name>
        <message>${this.escape(entry.error.message)}</message>
        <stack><![CDATA[${entry.error.stack}]]></stack>
    </error>`
            : '';

        const scopes = entry.scopes.map((scope) => `<scope>${this.escape(scope)}</scope>`).join('');

        return `<log>
    <timestamp>${entry.timestamp.toISOString()}</timestamp>
    <level>${LogLevel[entry.level]}</level>
    <message>${this.escape(entry.message)}</message>
    <scopes>${scopes}</scopes>
    ${metadata}
    ${error}
</log>`;
    }

    private escape(value: string): string {
        return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
    }
}
