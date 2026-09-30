import { RabbitMQPlugin } from './rabbitmq-plugin';
import { RabbitMQPluginOptionsFactory, RabbitMQPluginOptionsFactoryStatic } from './rabbitmq-plugin-options-factory';

describe('RabbitMQPluginOptionsFactoryStatic', () => {
    it('creates plugin options with the RabbitMQ plugin and supplied connections', () => {
        const connections = [{ name: 'PRIMARY', url: 'amqp://localhost' }];

        expect(new RabbitMQPluginOptionsFactoryStatic().create({ connections })).toEqual({
            plugin: RabbitMQPlugin,
            connections
        });
    });

    it('exports a ready-to-use factory instance', () => {
        expect(RabbitMQPluginOptionsFactory.create({ connections: [] })).toEqual({
            plugin: RabbitMQPlugin,
            connections: []
        });
    });
});
