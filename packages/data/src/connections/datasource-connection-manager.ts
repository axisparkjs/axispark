import { Injectable, Inject } from '@axisparkjs/di';
import { DATA_LOGGER, DATA_OPTIONS } from '../di';
import { DataPluginOptions } from '../plugin';
import { Logger } from '@axisparkjs/logger';
import { DataSource } from 'typeorm';

/**
 * A manager for creating and managing connections to TypeORM data sources.
 */
@Injectable()
export class DataSourceConnectionManager {
    private readonly connections = new Map<string, DataSource>();

    constructor(
        @Inject(DATA_OPTIONS) private readonly dataPluginOptions: DataPluginOptions,
        @Inject(DATA_LOGGER) private readonly logger: Logger
    ) {}

    async createConnections(): Promise<void> {
        for (const connectionConfig of this.dataPluginOptions.dataSources) {
            if (this.connections.has(connectionConfig.name)) {
                throw new Error(`Connection with name '${connectionConfig.name}' already exists. Connection names must be unique.`);
            }

            const dataSource = new DataSource(connectionConfig.options);
            await dataSource.initialize();
            this.connections.set(connectionConfig.name, dataSource);
            this.logger.info(`Connection '${connectionConfig.name}' established`);
        }
    }

    getConnection(name: string): DataSource | undefined {
        return this.connections.get(name);
    }

    getAllConnections(): Map<string, DataSource> {
        return new Map(this.connections);
    }

    async destroyConnections(): Promise<void> {
        for (const [name, connection] of this.connections.entries()) {
            await connection.destroy();
            this.connections.delete(name);
        }
    }
}
