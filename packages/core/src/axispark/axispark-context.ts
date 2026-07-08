import { ConsoleTransport, Logger, LogLevel, SimpleFormatter, LogTransport } from '@axisparkjs/logger';
import { PluginRegistry } from '..';
import { Container } from '@axisparkjs/di';
import { AxisparkConfig } from './axispark-config';

export class AxisparkContext {
    public readonly logger: Logger;
    public readonly plugins: PluginRegistry;
    public readonly container: Container;
    public readonly config: AxisparkConfig;

    public constructor(config?: AxisparkConfig) {
        this.config = {
            name: 'App',
            environment: 'development',
            banner: true,
            logTransports: [new ConsoleTransport({ formatter: new SimpleFormatter(), minLevel: LogLevel.TRACE })],
            ...config
        };
        this.logger = new Logger(this.config.logTransports as LogTransport[], [this.config.name as string]);
        this.plugins = new PluginRegistry();
        this.container = new Container();

        this.container.bind({
            token: Logger,
            useValue: this.logger
        });
    }
}
