import { MetadataKeys, Metadata } from '../metadata';
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
