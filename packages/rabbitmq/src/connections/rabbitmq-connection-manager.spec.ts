import { connect } from 'amqp-connection-manager';
import { RabbitMQConnectionManager } from './rabbitmq-connection-manager';

jest.mock('amqp-connection-manager', () => ({
    connect: jest.fn()
}));

const connectMock = jest.mocked(connect);

describe('RabbitMQConnectionManager', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const createManager = (connections: any[]) => new RabbitMQConnectionManager({ connections } as any);

    it('creates all configured connections and passes their settings through', async () => {
        const first = { close: jest.fn() };
        const second = { close: jest.fn() };
        connectMock.mockReturnValueOnce(first as any).mockReturnValueOnce(second as any);
        const configs = [
            { name: 'PRIMARY', url: 'amqp://primary', options: { heartbeatIntervalInSeconds: 10 } },
            { name: 'REPORTING', url: ['amqp://one', 'amqp://two'], options: {} }
        ];
        const manager = createManager(configs);

        await manager.createConnections();

        expect(connectMock).toHaveBeenNthCalledWith(1, configs[0].url, configs[0].options);
        expect(connectMock).toHaveBeenNthCalledWith(2, configs[1].url, configs[1].options);
        expect(manager.getConnection('PRIMARY')).toBe(first);
        expect(manager.getConnection('REPORTING')).toBe(second);
    });

    it('creates independent named connections when they share a URL', async () => {
        const first = { close: jest.fn() };
        const second = { close: jest.fn() };
        connectMock.mockReturnValueOnce(first as any).mockReturnValueOnce(second as any);
        const url = 'amqp://shared-host';
        const manager = createManager([
            { name: 'PUBLISHER', url },
            { name: 'CONSUMER', url }
        ]);

        await manager.createConnections();

        expect(connectMock).toHaveBeenNthCalledWith(1, url, undefined);
        expect(connectMock).toHaveBeenNthCalledWith(2, url, undefined);
        expect(manager.getConnection('PUBLISHER')).toBe(first);
        expect(manager.getConnection('CONSUMER')).toBe(second);
        expect(first).not.toBe(second);
    });

    it('propagates connection creation errors without registering a failed connection', async () => {
        const failure = new Error('broker unavailable');
        connectMock.mockImplementation(() => {
            throw failure;
        });
        const manager = createManager([{ name: 'PRIMARY', url: 'amqp://primary' }]);

        await expect(manager.createConnections()).rejects.toBe(failure);

        expect(manager.getConnection('PRIMARY')).toBeUndefined();
        expect(manager.getAllConnections()).toEqual(new Map());
    });

    it('allows a connection name to be reused after the connection was destroyed', async () => {
        const first = { close: jest.fn().mockResolvedValue(undefined) };
        const second = { close: jest.fn().mockResolvedValue(undefined) };
        connectMock.mockReturnValueOnce(first as any).mockReturnValueOnce(second as any);
        const manager = createManager([{ name: 'PRIMARY', url: 'amqp://primary' }]);

        await manager.createConnections();
        await manager.destroyConnections();
        await manager.createConnections();

        expect(connectMock).toHaveBeenCalledTimes(2);
        expect(first.close).toHaveBeenCalledTimes(1);
        expect(manager.getConnection('PRIMARY')).toBe(second);
    });

    it('does not create a second connection with a duplicate name', async () => {
        const connection = { close: jest.fn() };
        connectMock.mockReturnValue(connection as any);
        const manager = createManager([
            { name: 'PRIMARY', url: 'amqp://one' },
            { name: 'PRIMARY', url: 'amqp://two' }
        ]);

        await expect(manager.createConnections()).rejects.toThrow("Connection with name 'PRIMARY' already exists. Connection names must be unique.");
        expect(connectMock).toHaveBeenCalledTimes(1);
    });

    it('returns undefined for unknown names and a defensive copy of all connections', async () => {
        const connection = { close: jest.fn() };
        connectMock.mockReturnValue(connection as any);
        const manager = createManager([{ name: 'PRIMARY', url: 'amqp://primary' }]);
        await manager.createConnections();

        const allConnections = manager.getAllConnections();
        allConnections.clear();

        expect(manager.getConnection('MISSING')).toBeUndefined();
        expect(manager.getConnection('PRIMARY')).toBe(connection);
    });

    it('closes and removes every managed connection', async () => {
        const first = { close: jest.fn().mockResolvedValue(undefined) };
        const second = { close: jest.fn().mockResolvedValue(undefined) };
        connectMock.mockReturnValueOnce(first as any).mockReturnValueOnce(second as any);
        const manager = createManager([
            { name: 'PRIMARY', url: 'amqp://primary' },
            { name: 'REPORTING', url: 'amqp://reporting' }
        ]);
        await manager.createConnections();

        await manager.destroyConnections();

        expect(first.close).toHaveBeenCalledTimes(1);
        expect(second.close).toHaveBeenCalledTimes(1);
        expect(manager.getAllConnections().size).toBe(0);
    });

    it('allows creation and destruction when no connections are configured', async () => {
        const manager = createManager([]);

        await expect(manager.createConnections()).resolves.toBeUndefined();
        await expect(manager.destroyConnections()).resolves.toBeUndefined();
        expect(connectMock).not.toHaveBeenCalled();
    });
});
