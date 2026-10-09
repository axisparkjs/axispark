import { DataSource } from 'typeorm';
import { DataSourceConnectionManager } from './datasource-connection-manager';

jest.mock('typeorm', () => {
    const actual = jest.requireActual('typeorm');
    return { ...actual, DataSource: jest.fn() };
});

const dataSourceConstructor = jest.mocked(DataSource);

describe('DataSourceConnectionManager', () => {
    const logger = { info: jest.fn().mockResolvedValue(undefined) };

    beforeEach(() => {
        jest.clearAllMocks();
        dataSourceConstructor.mockReset();
    });

    const createManager = (dataSources: { name: string; options: any }[]) => new DataSourceConnectionManager({ dataSources } as any, logger as any);

    it('initializes and registers every configured named data source', async () => {
        const first = { initialize: jest.fn().mockResolvedValue(undefined), destroy: jest.fn() };
        const second = { initialize: jest.fn().mockResolvedValue(undefined), destroy: jest.fn() };
        dataSourceConstructor.mockImplementationOnce(() => first as any).mockImplementationOnce(() => second as any);
        const configurations = [
            { name: 'PRIMARY', options: { type: 'postgres', database: 'primary' } },
            { name: 'REPORTING', options: { type: 'sqlite', database: ':memory:' } }
        ];
        const manager = createManager(configurations);

        await manager.createConnections();

        expect(dataSourceConstructor).toHaveBeenNthCalledWith(1, configurations[0].options);
        expect(dataSourceConstructor).toHaveBeenNthCalledWith(2, configurations[1].options);
        expect(first.initialize).toHaveBeenCalledTimes(1);
        expect(second.initialize).toHaveBeenCalledTimes(1);
        expect(manager.getConnection('PRIMARY')).toBe(first);
        expect(manager.getConnection('REPORTING')).toBe(second);
        expect(logger.info).toHaveBeenCalledWith("Connection 'PRIMARY' established");
        expect(logger.info).toHaveBeenCalledWith("Connection 'REPORTING' established");
    });

    it('does not overwrite an existing connection with a duplicate name', async () => {
        const connection = { initialize: jest.fn().mockResolvedValue(undefined), destroy: jest.fn() };
        dataSourceConstructor.mockReturnValue(connection as any);
        const manager = createManager([
            { name: 'PRIMARY', options: { type: 'sqlite', database: ':memory:' } },
            { name: 'PRIMARY', options: { type: 'sqlite', database: 'other.db' } }
        ]);

        await expect(manager.createConnections()).rejects.toThrow("Connection with name 'PRIMARY' already exists");
        expect(dataSourceConstructor).toHaveBeenCalledTimes(1);
        expect(manager.getConnection('PRIMARY')).toBe(connection);
    });

    it('does not register a data source whose initialization fails', async () => {
        const failure = new Error('database unavailable');
        const connection = { initialize: jest.fn().mockRejectedValue(failure), destroy: jest.fn() };
        dataSourceConstructor.mockReturnValue(connection as any);
        const manager = createManager([{ name: 'PRIMARY', options: { type: 'sqlite', database: ':memory:' } }]);

        await expect(manager.createConnections()).rejects.toBe(failure);
        expect(manager.getConnection('PRIMARY')).toBeUndefined();
        expect(manager.getAllConnections()).toEqual(new Map());
    });

    it('returns undefined for an unknown name and a defensive copy of connections', async () => {
        const connection = { initialize: jest.fn().mockResolvedValue(undefined), destroy: jest.fn() };
        dataSourceConstructor.mockReturnValue(connection as any);
        const manager = createManager([{ name: 'PRIMARY', options: { type: 'sqlite', database: ':memory:' } }]);
        await manager.createConnections();

        const connections = manager.getAllConnections();
        connections.clear();

        expect(manager.getConnection('MISSING')).toBeUndefined();
        expect(manager.getConnection('PRIMARY')).toBe(connection);
    });

    it('destroys and removes every registered data source', async () => {
        const first = { initialize: jest.fn().mockResolvedValue(undefined), destroy: jest.fn().mockResolvedValue(undefined) };
        const second = { initialize: jest.fn().mockResolvedValue(undefined), destroy: jest.fn().mockResolvedValue(undefined) };
        dataSourceConstructor.mockImplementationOnce(() => first as any).mockImplementationOnce(() => second as any);
        const manager = createManager([
            { name: 'PRIMARY', options: { type: 'sqlite', database: ':memory:' } },
            { name: 'REPORTING', options: { type: 'sqlite', database: ':memory:' } }
        ]);
        await manager.createConnections();

        await manager.destroyConnections();

        expect(first.destroy).toHaveBeenCalledTimes(1);
        expect(second.destroy).toHaveBeenCalledTimes(1);
        expect(manager.getAllConnections()).toEqual(new Map());
    });

    it('allows empty configuration', async () => {
        const manager = createManager([]);

        await expect(manager.createConnections()).resolves.toBeUndefined();
        await expect(manager.destroyConnections()).resolves.toBeUndefined();
        expect(dataSourceConstructor).not.toHaveBeenCalled();
    });
});
