import { ConsoleTransport, Logger, LogLevel, SimpleFormatter, LogTransport } from '@axisparkjs/logger';
import { PluginRegistry } from '../plugin';
import { Container, Injector } from '@axisparkjs/di';
import { AxiSparkConfig } from './axispark-config';
import { ExecutionEngine } from '@axisparkjs/engine';
import { Scanner, FileSystemScanner, NullScanner } from '../scanner';
import { AxiSparkPrivateConfig } from './axispark-private-config';

export class AxiSparkContext {
    public readonly logger: Logger;
    public readonly plugins: PluginRegistry;
    public readonly container: Container;
    public readonly config: AxiSparkConfig;
    public readonly privateConfig: AxiSparkPrivateConfig;
    public readonly injector: Injector;
    public readonly engine: ExecutionEngine;
    public readonly scanner: Scanner;

    public constructor(config?: AxiSparkConfig, privateConfig?: AxiSparkPrivateConfig) {
        this.config = {
            name: 'App',
            environment: 'development',
            banner: true,
            logTransports: [new ConsoleTransport({ formatter: new SimpleFormatter(), minLevel: LogLevel.TRACE })],
            ...config
        };
        this.privateConfig = {
            scanner: 'file-system',
            ...privateConfig
        };
        this.logger = new Logger(this.config.logTransports as LogTransport[], [this.config.name as string]);
        this.plugins = new PluginRegistry();
        this.container = new Container();
        this.injector = new Injector(this.container);
        this.engine = new ExecutionEngine();
        this.scanner = this.privateConfig.scanner === 'null' ? new NullScanner() : new FileSystemScanner(this.config.basePath);

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
