import { ConsoleTransport, Logger, LogLevel, SimpleFormatter } from '@axisparkjs/logger';
import { Container, Injector } from '@axisparkjs/di';
import { AxiSparkContext } from './axispark-context';
import { PluginRegistry } from '../plugin';
import { NullScanner } from '../scanner';

describe('AxiSparkContext', () => {
    describe('constructor', () => {
        let context: AxiSparkContext;

        beforeEach(() => {
            context = new AxiSparkContext();
        });

        it('should create a logger', () => {
            expect(context.logger).toBeInstanceOf(Logger);
        });

        it('should create a plugin registry', () => {
            expect(context.plugins).toBeInstanceOf(PluginRegistry);
        });

        it('should create a DI container', () => {
            expect(context.container).toBeInstanceOf(Container);
        });

        it('should create an injector', () => {
            expect(context.injector).toBeInstanceOf(Injector);
        });

        it('should create an engine', () => {
            expect(context.engine).toBeDefined();
        });

        it('should create a scanner', () => {
            expect(context.scanner).toBeDefined();
        });

        it('should create the default private configuration', () => {
            expect(context.privateConfig).toMatchObject({
                scanner: 'file-system'
            });
        });

        it('should create the default configuration', () => {
            expect(context.config).toMatchObject({
                name: 'App',
                environment: 'development',
                banner: true
            });

            expect(context.config.logTransports).toHaveLength(1);
            expect(context.config.logTransports?.[0]).toBeInstanceOf(ConsoleTransport);
        });

        it('should register Logger in the container', async () => {
            expect(await context.container.resolve(Logger)).toBe(context.logger);
        });

        it('should register Injector in the container', async () => {
            expect(await context.container.resolve(Injector)).toBe(context.injector);
        });

        it('should override default configuration', () => {
            const transport = new ConsoleTransport({
                formatter: new SimpleFormatter(),
                minLevel: LogLevel.Error
            });

            const context = new AxiSparkContext(
                {
                    name: 'MyApp',
                    environment: 'production',
                    banner: false,
                    logTransports: [transport]
                },
                { wait: true, scanner: 'null' }
            );

            expect(context.config).toEqual({
                name: 'MyApp',
                environment: 'production',
                banner: false,
                logTransports: [transport]
            });

            expect(context.privateConfig).toEqual({
                wait: true,
                scanner: 'null'
            });

            expect(context.logger).toBeInstanceOf(Logger);
            expect(context.plugins).toBeInstanceOf(PluginRegistry);
            expect(context.container).toBeInstanceOf(Container);
            expect(context.injector).toBeInstanceOf(Injector);
            expect(context.engine).toBeDefined();
            expect(context.scanner).toBeInstanceOf(NullScanner);
        });
    });
});
