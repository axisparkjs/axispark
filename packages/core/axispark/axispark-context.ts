import { ConsoleTransport, Logger, LogLevel, SimpleFormatter } from '@axisparkjs/logger';
import { PluginRegistry } from '..';
import { Container } from '@axisparkjs/di';

export class AxisparkContext {
    public readonly logger: Logger;
    public readonly plugins: PluginRegistry;
    public readonly container: Container;

    public constructor(name: string) {
        this.logger = new Logger([new ConsoleTransport({ formatter: new SimpleFormatter(), minLevel: LogLevel.TRACE })], [name]);
        this.plugins = new PluginRegistry();
        this.container = new Container();

        this.container.bind({
            token: Logger,
            useValue: this.logger
        });
    }
}
