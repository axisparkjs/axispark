import { Factory } from '@axisparkjs/common';
import { KafkaPluginOptions } from './kafka-plugin-options';
import { KafkaPlugin } from './kafka-plugin';

/**
 * A factory for creating KafkaPluginOptions instances.
 */
export class KafkaPluginOptionsFactoryStatic implements Factory<KafkaPluginOptions> {
    create(options: Omit<KafkaPluginOptions, 'plugin'>): KafkaPluginOptions {
        return {
            plugin: KafkaPlugin,
            ...options
        };
    }
}

/**
 * A factory for creating KafkaPluginOptions instances.
 */
export const KafkaPluginOptionsFactory = new KafkaPluginOptionsFactoryStatic();
