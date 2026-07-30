import { MetadataKeys, Metadata } from '@axisparkjs/common';
import { Constructable } from './constructable';

describe('Constructable', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    it('should define metadata for CONSTRUCTABLE key', () => {
        const defineSpy = jest.spyOn(Metadata, 'define').mockImplementation();

        @Constructable()
        class TestClass {}

        expect(defineSpy).toHaveBeenCalledWith(MetadataKeys.CONSTRUCTABLE, true, TestClass);
    });
});
