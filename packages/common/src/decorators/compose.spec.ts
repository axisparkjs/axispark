import { MetadataKeys, Metadata } from '../metadata';
import { Compose } from './compose';

describe('Compose', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    it('should define metadata for a single key', () => {
        const defineSpy = jest.spyOn(Metadata, 'define').mockImplementation();

        const key = MetadataKeys.CONSTRUCTABLE;

        @Compose(key)
        class TestClass {}

        expect(defineSpy).toHaveBeenCalledWith(key, true, TestClass);
    });

    it('should define metadata for each provided key', () => {
        const defineSpy = jest.spyOn(Metadata, 'define').mockImplementation();

        const key1 = MetadataKeys.PLUGIN;
        const key2 = MetadataKeys.CONSTRUCTABLE;

        @Compose(key1, key2)
        class TestClass {}

        expect(defineSpy).toHaveBeenCalledWith(key1, true, TestClass);
        expect(defineSpy).toHaveBeenCalledWith(key2, true, TestClass);
    });
});
