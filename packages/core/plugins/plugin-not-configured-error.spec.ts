import { PluginNotConfiguredError } from './plugin-not-configured-error';

describe('PluginNotConfiguredError', () => {
    it('should create an error with the correct name and message', () => {
        const pluginName = 'LoggerPlugin';

        const error = new PluginNotConfiguredError(pluginName);

        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(PluginNotConfiguredError);
        expect(error.name).toBe('PluginNotConfiguredError');
        expect(error.message).toBe(
            'LoggerPlugin added without configuration when it was required. Please provide a configuration object when adding the plugin.'
        );
    });
});