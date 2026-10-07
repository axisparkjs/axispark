import { Factory } from '@axisparkjs/common';
import { SecurityPluginOptions } from './security-plugin-options';
import { SecurityPlugin } from './security-plugin';

/**
 * A factory for creating SecurityPluginOptions instances.
 */
export class SecurityPluginOptionsFactoryStatic implements Factory<SecurityPluginOptions> {
    create(options: Omit<SecurityPluginOptions, 'plugin'>): SecurityPluginOptions {
        return {
            plugin: SecurityPlugin,
            authenticator: {
                strategy: 'all'
            },
            ...options
        };
    }
}

/**
 * A factory for creating SecurityPluginOptions instances.
 */
export const SecurityPluginOptionsFactory = new SecurityPluginOptionsFactoryStatic();
