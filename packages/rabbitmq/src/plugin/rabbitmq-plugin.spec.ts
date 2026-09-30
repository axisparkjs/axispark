import { AxiSparkContext, PluginNotConfiguredError } from '@axisparkjs/core';
import { Logger } from '@axisparkjs/logger';
import { Injector, InjectionToken } from '@axisparkjs/di';
import { RabbitMQConnectionManager } from '../connections';
import { RABBITMQ_LOGGER, RABBITMQ_OPTIONS } from '../di';
import { RabbitMQPlugin } from './rabbitmq-plugin';
import { RabbitMQPluginOptions } from './rabbitmq-plugin-options';

describe('RabbitMQPlugin', () => {
    let plugin: RabbitMQPlugin;
    let logger: { child: jest.Mock; info: jest.Mock; error: jest.Mock };
    let connectionManager: { createConnections: jest.Mock; destroyConnections: jest.Mock; getAllConnections: jest.Mock };
    let injector: { get: jest.Mock };
    let context: { container: { bind: jest.Mock } };

    const options = (connections: any[] = []): RabbitMQPluginOptions => ({ connections, plugin: RabbitMQPlugin }) as RabbitMQPluginOptions;
    const appContext = () => context as unknown as AxiSparkContext;

    beforeEach(() => {
        jest.clearAllMocks();
        logger = {
            child: jest.fn(),
            info: jest.fn().mockResolvedValue(undefined),
            error: jest.fn().mockResolvedValue(undefined)
        };
        logger.child.mockReturnValue(logger);
        connectionManager = {
            createConnections: jest.fn().mockResolvedValue(undefined),
            destroyConnections: jest.fn().mockResolvedValue(undefined),
            getAllConnections: jest.fn().mockReturnValue(new Map())
        };
        injector = {
            get: jest.fn().mockImplementation((token) => Promise.resolve(token === RabbitMQConnectionManager ? connectionManager : undefined))
        };
        context = { container: { bind: jest.fn() } };
        plugin = new RabbitMQPlugin(logger as unknown as Logger, injector as unknown as Injector);
    });

    it('rejects registration without plugin options', async () => {
        await expect(plugin.onRegister(appContext())).rejects.toBeInstanceOf(PluginNotConfiguredError);
        expect(injector.get).not.toHaveBeenCalled();
    });

    it('binds options and logger, creates connections, and binds each connection by its namespaced token', async () => {
        const primary = { on: jest.fn() };
        const reports = { on: jest.fn() };
        connectionManager.getAllConnections.mockReturnValue(
            new Map([
                ['PRIMARY', primary],
                ['REPORTS', reports]
            ])
        );
        const configuredOptions = options([
            { name: 'PRIMARY', url: 'amqp://primary' },
            { name: 'REPORTS', url: 'amqp://reports' }
        ]);

        await plugin.onRegister(appContext(), configuredOptions);

        expect(logger.child).toHaveBeenCalledWith('RabbitMQPlugin');
        expect(context.container.bind).toHaveBeenCalledWith({ token: RABBITMQ_OPTIONS, useValue: configuredOptions });
        expect(context.container.bind).toHaveBeenCalledWith({ token: RABBITMQ_LOGGER, useValue: logger });
        expect(injector.get).toHaveBeenCalledWith(RabbitMQConnectionManager);
        expect(connectionManager.createConnections).toHaveBeenCalledTimes(1);
        expect(primary.on).toHaveBeenCalledWith('connect', expect.any(Function));
        expect(primary.on).toHaveBeenCalledWith('connectFailed', expect.any(Function));
        expect(primary.on).toHaveBeenCalledWith('disconnect', expect.any(Function));
        expect(reports.on).toHaveBeenCalledWith('connect', expect.any(Function));
        expect(reports.on).toHaveBeenCalledWith('connectFailed', expect.any(Function));
        expect(reports.on).toHaveBeenCalledWith('disconnect', expect.any(Function));
        expect(context.container.bind).toHaveBeenCalledWith({
            token: new InjectionToken('RABBITMQ_CONNECTION_PRIMARY'),
            useValue: primary
        });
        expect(context.container.bind).toHaveBeenCalledWith({
            token: new InjectionToken('RABBITMQ_CONNECTION_REPORTS'),
            useValue: reports
        });
        expect(logger.info).toHaveBeenCalledWith('Plugin registered');
    });

    it('logs connection and disconnection events, including disconnect errors', async () => {
        const connection = { on: jest.fn() };
        connectionManager.getAllConnections.mockReturnValue(new Map([['PRIMARY', connection]]));
        await plugin.onRegister(appContext(), options([{ name: 'PRIMARY', url: 'amqp://primary' }]));
        const connectHandler = connection.on.mock.calls.find(([event]) => event === 'connect')[1];
        const disconnectHandler = connection.on.mock.calls.find(([event]) => event === 'disconnect')[1];
        const disconnectError = new Error('connection dropped');

        connectHandler();
        disconnectHandler();
        disconnectHandler(disconnectError);

        expect(logger.info).toHaveBeenCalledWith("Connection 'PRIMARY' established");
        expect(logger.info).toHaveBeenCalledWith("Connection 'PRIMARY' finished");
        expect(logger.error).toHaveBeenCalledWith("Connection 'PRIMARY' disconnected with error", disconnectError);
    });

    it('logs failed connection attempts', async () => {
        const connection = { on: jest.fn() };
        connectionManager.getAllConnections.mockReturnValue(new Map([['PRIMARY', connection]]));
        await plugin.onRegister(appContext(), options([{ name: 'PRIMARY', url: 'amqp://primary' }]));
        const connectFailedHandler = connection.on.mock.calls.find(([event]) => event === 'connectFailed')[1];
        const connectError = new Error('unable to connect');

        connectFailedHandler({ err: connectError });

        expect(logger.error).toHaveBeenCalledWith("Connection 'PRIMARY' encountered an error", connectError);
    });

    it('propagates connection startup failures without logging successful registration', async () => {
        const failure = new Error('connection manager failed');
        connectionManager.createConnections.mockRejectedValue(failure);

        await expect(plugin.onRegister(appContext(), options([{ name: 'PRIMARY', url: 'amqp://primary' }]))).rejects.toBe(failure);

        expect(connectionManager.getAllConnections).not.toHaveBeenCalled();
        expect(logger.info).not.toHaveBeenCalledWith('Plugin registered');
    });

    it('logs startup and closes all connections during shutdown', async () => {
        await plugin.onRegister(appContext(), options());

        await plugin.onStart();
        await plugin.onStop();

        expect(logger.info).toHaveBeenCalledWith('Plugin started');
        expect(connectionManager.destroyConnections).toHaveBeenCalledTimes(1);
        expect(logger.info).toHaveBeenCalledWith('Plugin stopped');
    });
});
