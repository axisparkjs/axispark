import { InjectableToken } from './injectable-token';
import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { InjectionToken } from '../token';

describe('InjectableToken', () => {
    it('should define the injectable token metadata on the target class', () => {
        const defineSpy = jest.spyOn(Metadata, 'define');
        const token = new InjectionToken('TEST_TOKEN');

        @InjectableToken(token)
        class TestClass {}

        expect(defineSpy).toHaveBeenCalledTimes(1);
        expect(defineSpy).toHaveBeenCalledWith(MetadataKeys.INJECTABLE_TOKEN, { target: TestClass, injectionToken: token }, TestClass);

        defineSpy.mockRestore();
    });
});
