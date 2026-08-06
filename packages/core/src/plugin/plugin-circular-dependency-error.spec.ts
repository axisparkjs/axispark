import { PluginCircularDependencyError } from './plugin-circular-dependency-error';

describe('PluginCircularDependencyError', () => {
    it('should create an error with the correct name and message', () => {
        const error = new PluginCircularDependencyError();

        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(PluginCircularDependencyError);
        expect(error.name).toBe('PluginCircularDependencyError');
        expect(error.message).toBe('Circular dependency detected among plugins');
    });
});
