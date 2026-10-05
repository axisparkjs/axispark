import { DataPlugin } from './data-plugin';
import { DataPluginOptionsFactory, DataPluginOptionsFactoryStatic } from './data-plugin-options-factory';

describe('DataPluginOptionsFactory', () => {
    it('adds DataPlugin to the supplied options', () => {
        const options = { dataSources: [] };

        expect(new DataPluginOptionsFactoryStatic().create(options)).toEqual({ plugin: DataPlugin, ...options });
    });

    it('exports a ready-to-use singleton factory', () => {
        expect(DataPluginOptionsFactory.create({ dataSources: [] })).toEqual({ plugin: DataPlugin, dataSources: [] });
    });
});
