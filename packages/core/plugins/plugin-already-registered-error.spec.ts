import { PluginAlreadyRegisteredError } from './plugin-already-registered-error';

describe('PluginAlreadyRegisteredError', () => {
    it('should create an error with the correct name and message', () => {
        const pluginName = 'LoggerPlugin';

        const error = new PluginAlreadyRegisteredError(pluginName);

        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(PluginAlreadyRegisteredError);
        expect(error.name).toBe('PluginAlreadyRegisteredError');
        expect(error.message).toBe('LoggerPlugin is already registered.');
    });
});