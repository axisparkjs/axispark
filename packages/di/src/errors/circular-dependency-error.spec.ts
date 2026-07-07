import { CircularDependencyError } from './circular-dependency-error';

describe('CircularDependencyError', () => {
    it('should create an error with the correct message', () => {
        const path = 'ServiceA -> ServiceB -> ServiceA';

        const error = new CircularDependencyError(path);

        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(CircularDependencyError);
        expect(error.message).toBe('Circular dependency detected: ServiceA -> ServiceB -> ServiceA');
    });
});
