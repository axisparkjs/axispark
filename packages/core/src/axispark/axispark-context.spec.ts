import {
    ConsoleTransport,
    Logger,
    LogLevel,
    SimpleFormatter
} from '@axisparkjs/logger';
import { Container, Injector } from '@axisparkjs/di';
import { AxisparkContext } from './axispark-context';
import { PluginRegistry } from '../plugin';

describe('AxisparkContext', () => {
    describe('constructor', () => {
        let context: AxisparkContext;

        beforeEach(() => {
            context = new AxisparkContext();
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

        it('should create the default configuration', () => {
            expect(context.config).toMatchObject({
                name: 'App',
                environment: 'development',
                banner: true
            });

            expect(context.config.logTransports).toHaveLength(1);
            expect(context.config.logTransports?.[0]).toBeInstanceOf(ConsoleTransport);
        });

        it('should register Logger in the container', () => {
            expect(context.container.resolve(Logger)).toBe(context.logger);
        });

        it('should register Injector in the container', () => {
            expect(context.container.resolve(Injector)).toBe(context.injector);
        });

        it('should override default configuration', () => {
            const transport = new ConsoleTransport({
                formatter: new SimpleFormatter(),
                minLevel: LogLevel.ERROR
            });

            const context = new AxisparkContext({
                name: 'MyApp',
                environment: 'production',
                banner: false,
                logTransports: [transport]
            });

            expect(context.config).toEqual({
                name: 'MyApp',
                environment: 'production',
                banner: false,
                logTransports: [transport]
            });

            expect(context.logger).toBeInstanceOf(Logger);
        });
    });
});