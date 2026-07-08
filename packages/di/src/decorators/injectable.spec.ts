import { MetadataKeys, Metadata } from '@axisparkjs/common';
import { Injectable } from './injectable';

describe('Injectable', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    it('should define metadata for CONSTRUCTABLE and INJECTABLE key', () => {
        const defineSpy = jest.spyOn(Metadata, 'define').mockImplementation();

        @Injectable()
        class TestClass {}

        expect(defineSpy).toHaveBeenCalledWith(MetadataKeys.CONSTRUCTABLE, true, TestClass);
        expect(defineSpy).toHaveBeenCalledWith(MetadataKeys.INJECTABLE, true, TestClass);
    });
});
