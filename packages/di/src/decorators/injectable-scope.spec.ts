import { InjectableScope } from './injectable-scope';
import { InjectableScopes } from '../types';
import { Metadata, MetadataKeys } from '@axisparkjs/common';

describe('InjectableScope', () => {
    it('should define the injectable scope metadata on the target class', () => {
        const defineSpy = jest.spyOn(Metadata, 'define');

        @InjectableScope(InjectableScopes.Singleton)
        class TestClass {}

        expect(defineSpy).toHaveBeenCalledTimes(1);
        expect(defineSpy).toHaveBeenCalledWith(MetadataKeys.INJECTABLE_SCOPE, { target: TestClass, scope: InjectableScopes.Singleton }, TestClass);

        defineSpy.mockRestore();
    });
});
