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
        const metadata = new Map<number, Token>();
        metadata.set(0, token);

        class TestClass {
            constructor(@Inject(token) _param: any) {}
        }

        expect(defineSpy).toHaveBeenCalledWith(MetadataKeys.INJECT, { target: TestClass, params: metadata }, TestClass);
    });

    it('should define metadata for INJECT key and add multiple token names as map to constructor parameters', () => {
        const defineSpy = jest.spyOn(Metadata, 'define').mockImplementation();
        jest.spyOn(Metadata, 'get').mockReturnValue({ target: undefined, params: new Map([[0, token]]) });
        const metadata = new Map<number, Token>();
        metadata.set(0, token);
        metadata.set(1, token);

        class TestClass {
            constructor(@Inject(token) _param1: any, @Inject(token) _param2: any) {}
        }

        expect(defineSpy).toHaveBeenCalledWith(MetadataKeys.INJECT, { target: TestClass, params: metadata }, TestClass);
    });
});
