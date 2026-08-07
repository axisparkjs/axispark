import { InjectionToken } from '../token';
import { ScopedContainerNotProvidedError } from './scoped-container-not-provided-error';

describe('ScopedContainerNotProvidedError', () => {
    it('should create an error with the correct message', () => {
        const error = new ScopedContainerNotProvidedError(new InjectionToken('test'));

        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(ScopedContainerNotProvidedError);
        expect(error.message).toBe(`No scoped container provided for 'test'.`);
    });
});
