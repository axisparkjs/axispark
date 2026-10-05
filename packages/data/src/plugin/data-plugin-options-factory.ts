import { Factory } from '@axisparkjs/common';
import { DataPluginOptions } from './data-plugin-options';
import { DataPlugin } from './data-plugin';

/**
 * A factory for creating DataPluginOptions instances.
 */
export class DataPluginOptionsFactoryStatic implements Factory<DataPluginOptions> {
    create(options: Omit<DataPluginOptions, 'plugin'>): DataPluginOptions {
        return {
            plugin: DataPlugin,
            ...options
        };
    }
}

/**
 * An instance of the DataPluginOptionsFactoryStatic class, used for creating DataPluginOptions instances.
 */
export const DataPluginOptionsFactory = new DataPluginOptionsFactoryStatic();
