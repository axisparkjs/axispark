import { PluginConfigMismatchError } from './plugin-config-mismatch-error';

describe('PluginConfigMismatchError', () => {
    it('should create an error with the correct name and message', () => {
        const pluginName = 'LoggerPlugin';

        const error = new PluginConfigMismatchError(pluginName);

        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(PluginConfigMismatchError);
        expect(error.name).toBe('PluginConfigMismatchError');
        expect(error.message).toBe('LoggerPlugin configuration does not match the expected format.');
    });
});
