import { FilteredErrorResolver } from './filtered-error-resolver';

describe('FilteredErrorResolver', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return the execution error', () => {
        const resolver = new FilteredErrorResolver();
        const error = new Error('boom');

        const context = {
            error
        } as any;

        expect(resolver.resolve(context)).toBe(error);
    });

    it('should return undefined when there is no error', () => {
        const resolver = new FilteredErrorResolver();

        const context = {} as any;

        expect(resolver.resolve(context)).toBeUndefined();
    });
});
