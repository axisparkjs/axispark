import { LogEntry } from '../log-entry';
import { LogFormatter } from '../log-formatter';
import { LogLevel } from '../log-level';

export class PrettyFormatter implements LogFormatter {
    format(entry: LogEntry): string {
        const timestamp = entry.timestamp.toISOString();
        const level = LogLevel[entry.level].padEnd(5);
        const scope = entry.scopes.length ? `[${entry.scopes.join(' > ')}]` : '';

        let output = `${timestamp} │ ${level}`;

        if (scope) {
            output += ` │ ${scope}`;
        }

        output += `\n  ${entry.message}`;

        if (entry.metadata && Object.keys(entry.metadata).length > 0) {
            output += `\n  Metadata:`;
            output += `\n${this.indent(JSON.stringify(entry.metadata, null, 2), 4)}`;
        }

        if (entry.error) {
            output += `\n  Error: ${entry.error.name}: ${entry.error.message}`;

            if (entry.error.stack) {
                output += `\n${this.indent(entry.error.stack, 4)}`;
            }
        }

        return output;
    }

    private indent(text: string, spaces: number): string {
        const padding = ' '.repeat(spaces);
        return text
            .split('\n')
            .map((line) => padding + line)
            .join('\n');
    }
}
