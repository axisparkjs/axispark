import { Metadata } from '@axisparkjs/common';
import { ParametersResolver } from './parameters-resolver';
import { ParameterResolver } from './parameter-resolver';

jest.mock('@axisparkjs/common', () => ({
    Metadata: {
        getMethod: jest.fn(),
    },
    MetadataKeys: {
        PARAMETER: 'PARAMETER',
    },
}));

describe('ParametersResolver', () => {
    const executionContext = { transport: 'http' } as any;
    const executionHandler = {
        target: class Controller {},
        method: 'find',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (Metadata.getMethod as jest.Mock).mockReturnValue([]);

        (ParametersResolver as any).resolvers.clear();
    });

    it('should return an empty array when no parameters are registered', () => {
        (Metadata.getMethod as jest.Mock).mockReturnValue(undefined);
        const result = ParametersResolver.resolve(executionContext, executionHandler);

        expect(result).toEqual([]);
    });

    it('should resolve a parameter', () => {
        const resolver: ParameterResolver<string> = {
            resolve: jest.fn().mockReturnValue('value'),
        };

        ParametersResolver.register('test', resolver);

        (Metadata.getMethod as jest.Mock).mockReturnValue([
            {
                parameter: 'test',
                index: 0,
                name: 'id',
            },
        ]);

        const result = ParametersResolver.resolve(executionContext, executionHandler);

        expect(resolver.resolve).toHaveBeenCalledWith(executionContext, {
            parameter: 'test',
            index: 0,
            name: 'id',
        });

        expect(result).toEqual(['value']);
    });

    it('should resolve multiple parameters', () => {
        const resolver1 = {
            resolve: jest.fn().mockReturnValue('one'),
        };

        const resolver2 = {
            resolve: jest.fn().mockReturnValue(2),
        };

        ParametersResolver.register('first', resolver1);
        ParametersResolver.register('second', resolver2);

        (Metadata.getMethod as jest.Mock).mockReturnValue([
            {
                parameter: 'first',
                index: 0,
            },
            {
                parameter: 'second',
                index: 1,
            },
        ]);

        const result = ParametersResolver.resolve(executionContext, executionHandler);

        expect(result).toEqual(['one', 2]);
    });

    it('should ignore parameters without a registered resolver', () => {
        const resolver = {
            resolve: jest.fn().mockReturnValue('value'),
        };

        ParametersResolver.register('known', resolver);

        (Metadata.getMethod as jest.Mock).mockReturnValue([
            {
                parameter: 'unknown',
                index: 0,
            },
        ]);

        const result = ParametersResolver.resolve(executionContext, executionHandler);

        expect(resolver.resolve).not.toHaveBeenCalled();
        expect(result).toEqual([]);
    });

    it('should preserve parameter indexes', () => {
        const resolver = {
            resolve: jest.fn().mockReturnValue('value'),
        };

        ParametersResolver.register('test', resolver);

        (Metadata.getMethod as jest.Mock).mockReturnValue([
            {
                parameter: 'test',
                index: 2,
            },
        ]);

        const result = ParametersResolver.resolve(executionContext, executionHandler);

        expect(result[0]).toBeUndefined();
        expect(result[1]).toBeUndefined();
        expect(result[2]).toBe('value');
    });

    it('should overwrite a registered resolver', () => {
        const resolver1 = {
            resolve: jest.fn().mockReturnValue('old'),
        };

        const resolver2 = {
            resolve: jest.fn().mockReturnValue('new'),
        };

        ParametersResolver.register('test', resolver1);
        ParametersResolver.register('test', resolver2);

        (Metadata.getMethod as jest.Mock).mockReturnValue([
            {
                parameter: 'test',
                index: 0,
            },
        ]);

        const result = ParametersResolver.resolve(executionContext, executionHandler);

        expect(resolver1.resolve).not.toHaveBeenCalled();
        expect(resolver2.resolve).toHaveBeenCalled();
        expect(result).toEqual(['new']);
    });
});