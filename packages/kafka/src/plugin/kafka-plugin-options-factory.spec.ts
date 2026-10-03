import { KafkaPlugin } from './kafka-plugin';
import { KafkaPluginOptionsFactory, KafkaPluginOptionsFactoryStatic } from './kafka-plugin-options-factory';

describe('KafkaPluginOptionsFactoryStatic', () => {
    it('creates plugin options with the Kafka plugin and supplied connections', () => {
        const connections = [
            {
                name: 'PRIMARY',
                config: { clientId: 'primary', brokers: ['localhost:9092'] },
                autoInitialize: false
            }
        ];

        expect(new KafkaPluginOptionsFactoryStatic().create({ connections })).toEqual({
            plugin: KafkaPlugin,
            connections
        });
    });

    it('exports a ready-to-use factory instance', () => {
        expect(KafkaPluginOptionsFactory.create({ connections: [] })).toEqual({
            plugin: KafkaPlugin,
            connections: []
        });
    });
});
