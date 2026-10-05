import { Factory } from '@axisparkjs/common';
import { DataPluginOptions } from './data-plugin-options';
import { DataPlugin } from './data-plugin';

/**
 * A factory for creating DataPluginOptions instances.
 */
export class DataPluginOptionsFactoryStatic implements Factory<DataPluginOptions> {
    /**
     * Adds `DataPlugin` as the plugin class to the supplied configuration.
     * @param options Data plugin settings, excluding the plugin class.
     */
    create(options: Omit<DataPluginOptions, 'plugin'>): DataPluginOptions {
        return {
            plugin: DataPlugin,
            ...options
        };
    }
}

/** Ready-to-use singleton factory for creating {@link DataPluginOptions}. */
export const DataPluginOptionsFactory = new DataPluginOptionsFactoryStatic();
