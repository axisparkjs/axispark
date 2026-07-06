import { ProviderNotFoundError } from './provider-not-found-error';
import { TokenUtils } from '../token';

describe('ProviderNotFoundError', () => {
    it('should create an error with the correct message', () => {
        class UserService {}

        const error = new ProviderNotFoundError(UserService);

        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(ProviderNotFoundError);
        expect(error.message).toBe(`No provider found for '${TokenUtils.getName(UserService)}'.`);
    });
});
