import { SecurityPlugin } from './security-plugin';
import { SecurityPluginOptionsFactory, SecurityPluginOptionsFactoryStatic } from './security-plugin-options-factory';

describe('SecurityPluginOptionsFactory', () => {
    it('adds the plugin and default all-authenticator strategy', () => {
        const options = { label: 'test' } as any;

        expect(new SecurityPluginOptionsFactoryStatic().create(options)).toEqual({
            plugin: SecurityPlugin,
            authenticator: { strategy: 'all' },
            ...options
        });
    });

    it('preserves an explicitly supplied authenticator configuration', () => {
        const authenticator = { strategy: 'selected', selected: [] };

        expect(SecurityPluginOptionsFactory.create({ authenticator } as any)).toEqual({ plugin: SecurityPlugin, authenticator });
    });
});
