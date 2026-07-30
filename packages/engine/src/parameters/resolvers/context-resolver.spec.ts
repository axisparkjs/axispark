import { ContextResolver } from './context-resolver';

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
