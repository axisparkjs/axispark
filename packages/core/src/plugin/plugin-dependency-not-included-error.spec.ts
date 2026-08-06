import { PluginDependencyNotIncludedError } from './plugin-dependency-not-included-error';

describe('PluginDependencyNotIncludedError', () => {
    it('should create an error with the correct name and message', () => {
        const error = new PluginDependencyNotIncludedError('LoggerPlugin');

        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(PluginDependencyNotIncludedError);
        expect(error.name).toBe('PluginDependencyNotIncludedError');
        expect(error.message).toBe('Plugin dependency not included: LoggerPlugin');
    });
});
