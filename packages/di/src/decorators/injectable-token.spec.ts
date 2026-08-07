import { InjectableToken } from './injectable-token';
import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { InjectionToken } from '@axisparkjs/di';

describe('InjectableToken', () => {
    it('should define the injectable token metadata on the target class', () => {
        const defineSpy = jest.spyOn(Metadata, 'define');

        const token = Symbol('TEST_TOKEN') as InjectionToken;

        @InjectableToken(token)
        class TestClass {}

        expect(defineSpy).toHaveBeenCalledTimes(1);
        expect(defineSpy).toHaveBeenCalledWith(MetadataKeys.INJECTABLE_TOKEN, token, TestClass);

        defineSpy.mockRestore();
    });
});
