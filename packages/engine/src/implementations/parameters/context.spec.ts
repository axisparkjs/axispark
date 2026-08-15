import { ContextResolver, Context, ContextName } from './context';
import { Parameter } from '../../decorators';

jest.mock('../../decorators', () => ({
    Parameter: jest.fn()
}));

describe('Context', () => {
    it('should call Parameter with ContextName', () => {
        Context();

        expect(Parameter).toHaveBeenCalledWith(ContextName);
    });
});

describe('ContextResolver', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return the execution context', () => {
        const resolver = new ContextResolver();
        const context = {
            transport: 'http',
            request: {}
        } as any;

        expect(resolver.resolve(context)).toBe(context);
    });
});
