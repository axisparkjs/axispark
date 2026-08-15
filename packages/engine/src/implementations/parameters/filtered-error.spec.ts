import { FilteredErrorResolver, FilteredError, FilteredErrorName } from './filtered-error';
import { Parameter } from '../../decorators';

jest.mock('../../decorators', () => ({
    Parameter: jest.fn()
}));

describe('FilteredError', () => {
    it('should call Parameter with FilteredErrorName', () => {
        FilteredError();

        expect(Parameter).toHaveBeenCalledWith(FilteredErrorName);
    });
});

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
