import { PluginOptions } from '@axisparkjs/core';
import { DataSourceOptions } from 'typeorm';

/**
 * Interface representing the options for configuring the Data plugin.
 */
export interface DataPluginOptions extends PluginOptions {
    dataSources: { name: string; options: DataSourceOptions }[];
}
