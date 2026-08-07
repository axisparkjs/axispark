import { ScopeDependencyError } from './scope-dependency-error';

describe('ScopeDependencyError', () => {
    it('should create an error with the correct message', () => {
        const error = new ScopeDependencyError('test');

        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(ScopeDependencyError);
        expect(error.message).toBe(`Scope dependency restriction detected: test. Singleton services cannot depend on scoped or transient services.`);
    });
});
