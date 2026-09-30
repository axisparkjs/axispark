import { Factory } from '@axisparkjs/common';
import { RabbitMQPluginOptions } from './rabbitmq-plugin-options';
import { RabbitMQPlugin } from './rabbitmq-plugin';

/**
 * A factory for creating RabbitMQPluginOptions instances.
 */
export class RabbitMQPluginOptionsFactoryStatic implements Factory<RabbitMQPluginOptions> {
    create(options: Omit<RabbitMQPluginOptions, 'plugin'>): RabbitMQPluginOptions {
        return {
            plugin: RabbitMQPlugin,
            ...options
        };
    }
}

/**
 * A factory for creating RabbitMQPluginOptions instances.
 */
export const RabbitMQPluginOptionsFactory = new RabbitMQPluginOptionsFactoryStatic();
