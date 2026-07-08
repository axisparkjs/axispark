import { MetadataKeys, Metadata } from '@axisparkjs/common';
import { Inject } from './inject';
import { InjectionToken, Token } from '../token';

describe('Inject', () => {
    const token = new InjectionToken('token');

    beforeEach(() => {
        jest.restoreAllMocks();
    });

    it('should define metadata for INJECT key and add token name as map to constructor parameters', () => {
        const defineSpy = jest.spyOn(Metadata, 'define').mockImplementation();
        const map = new Map<number, Token>();
        map.set(0, token);

        class TestClass {
            constructor(@Inject(token) _param: any) {}
        }

        expect(defineSpy).toHaveBeenCalledWith(MetadataKeys.INJECT, map, TestClass);
    });

    it('should define metadata for INJECT key and add multiple token names as map to constructor parameters', () => {
        const defineSpy = jest.spyOn(Metadata, 'define').mockImplementation();
        jest.spyOn(Metadata, 'get').mockReturnValue(new Map([[0, token]]));
        const map = new Map<number, Token>();
        map.set(0, token);
        map.set(1, token);

        class TestClass {
            constructor(@Inject(token) _param1: any, @Inject(token) _param2: any) {}
        }

        expect(defineSpy).toHaveBeenCalledWith(MetadataKeys.INJECT, map, TestClass);
    });
});
