import { Factory } from '@axisparkjs/common';
import { SecurityPluginOptions } from './security-plugin-options';
import { SecurityPlugin } from './security-plugin';

/**
 * Creates a complete security plugin configuration from application options.
 * The factory supplies the {@link SecurityPlugin} class and defaults the
 * authenticator strategy to `all`; explicitly providing `authenticator`
 * replaces that default configuration.
 */
export class SecurityPluginOptionsFactoryStatic implements Factory<SecurityPluginOptions> {
    /**
     * @param options Plugin configuration excluding the plugin class itself.
     * @returns Options ready to pass to `app.use()`.
     */
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
 * Shared factory instance for creating security plugin options.
 */
export const SecurityPluginOptionsFactory = new SecurityPluginOptionsFactoryStatic();
