import { Injectable, Inject } from '@axisparkjs/di';
import { RABBITMQ_OPTIONS } from '../di';
import { RabbitMQPluginOptions } from '../plugin';
import { AmqpConnectionManager, AmqpConnectionManagerOptions, ConnectionUrl, connect } from 'amqp-connection-manager';

/**
 * A manager for creating and managing connections to RabbitMQ.
 */
@Injectable()
export class RabbitMQConnectionManager {
    private readonly connections = new Map<string, AmqpConnectionManager>();

    constructor(@Inject(RABBITMQ_OPTIONS) private readonly rabbitmqPluginOptions: RabbitMQPluginOptions) {}

    async createConnections(): Promise<void> {
        for (const connectionConfig of this.rabbitmqPluginOptions.connections) {
            const { name, url, options } = connectionConfig;
            if (this.connections.has(name)) {
                throw new Error(`Connection with name '${name}' already exists. Connection names must be unique.`);
            }

            const connection = await this.createConnection(url, options);
            this.connections.set(name, connection);
        }
    }

    private async createConnection(url: ConnectionUrl | ConnectionUrl[], options?: AmqpConnectionManagerOptions): Promise<AmqpConnectionManager> {
        return await connect(url, options);
    }

    getConnection(name: string): AmqpConnectionManager | undefined {
        return this.connections.get(name);
    }

    getAllConnections(): Map<string, AmqpConnectionManager> {
        return new Map(this.connections);
    }

    async destroyConnections(): Promise<void> {
        for (const [name, connection] of this.connections.entries()) {
            await connection.close();
            this.connections.delete(name);
        }
    }
}
