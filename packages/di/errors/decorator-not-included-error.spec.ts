import { DecoratorNotIncludedError } from './decorator-not-included-error';

describe('DecoratorNotIncludedError', () => {
    it('should create an error with the correct name and message', () => {
        const className = 'UserService';
        const decoratorName = 'Injectable';

        const error = new DecoratorNotIncludedError(className, decoratorName);

        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(DecoratorNotIncludedError);
        expect(error.name).toBe('DecoratorNotIncludedError');
        expect(error.message).toBe('UserService is not decorated with @Injectable. Please decorate it before binding.');
    });
});
