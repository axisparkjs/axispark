import { ConsoleTransport, Logger, LogLevel, SimpleFormatter, LogTransport } from '@axisparkjs/logger';
import { PluginRegistry } from '..';
import { Container, Injector } from '@axisparkjs/di';
import { AxiSparkConfig } from './axispark-config';

export class AxiSparkContext {
    public readonly logger: Logger;
    public readonly plugins: PluginRegistry;
    public readonly container: Container;
    public readonly config: AxiSparkConfig;
    public readonly injector: Injector;

    public constructor(config?: AxiSparkConfig) {
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
        this.injector = new Injector(this.container);

        this.container.bind({
            token: Logger,
            useValue: this.logger
        });
        this.container.bind({
            token: Injector,
            useValue: this.injector
        });
    }
}
