import { Metadata } from './metadata';
import { MetadataKey } from './metadata-key';
import { MetadataKeys } from './metadata-keys';

describe('Metadata', () => {
    const testKey: MetadataKey = MetadataKeys.CONSTRUCTABLE;

    class TestClass {
        myMethod(): void {}
    }

    beforeEach(() => {
        jest.restoreAllMocks();
    });

    describe('define', () => {
        it('should call Reflect.defineMetadata with constructor when target is an instance', () => {
            const spy = jest.spyOn(Reflect, 'defineMetadata').mockImplementation();

            const value = { foo: 'bar' };
            const target = new TestClass();

            Metadata.define(testKey, value, target);

            expect(spy).toHaveBeenCalledWith(testKey.value, value, TestClass);
        });

        it('should call Reflect.defineMetadata with target when it is already a constructor', () => {
            const spy = jest.spyOn(Reflect, 'defineMetadata').mockImplementation();

            const value = { foo: 'bar' };

            Metadata.define(testKey, value, TestClass);

            expect(spy).toHaveBeenCalledWith(testKey.value, value, TestClass);
        });
    });

    describe('defineMethod', () => {
        it('should call Reflect.defineMetadata with normalized target and method name', () => {
            const spy = jest.spyOn(Reflect, 'defineMetadata').mockImplementation();

            const value = { foo: 'bar' };
            const target = new TestClass();

            Metadata.defineMethod(testKey, value, target, 'myMethod');

            expect(spy).toHaveBeenCalledWith(testKey.value, value, TestClass, 'myMethod');
        });
    });

    describe('get', () => {
        it('should return metadata from Reflect.getMetadata', () => {
            const expected = { foo: 'bar' };
            const spy = jest.spyOn(Reflect, 'getMetadata').mockReturnValue(expected);

            const result = Metadata.get(testKey, new TestClass());

            expect(result).toBe(expected);
            expect(spy).toHaveBeenCalledWith(testKey.value, TestClass);
        });

        it('should return undefined when metadata does not exist', () => {
            jest.spyOn(Reflect, 'getMetadata').mockReturnValue(undefined);

            const result = Metadata.get(testKey, new TestClass());

            expect(result).toBeUndefined();
        });
    });

    describe('getMethod', () => {
        it('should return metadata from Reflect.getMetadata with method name', () => {
            const expected = { foo: 'bar' };
            const spy = jest.spyOn(Reflect, 'getMetadata').mockReturnValue(expected);

            const result = Metadata.getMethod(testKey, new TestClass(), 'myMethod');

            expect(result).toBe(expected);
            expect(spy).toHaveBeenCalledWith(testKey.value, TestClass, 'myMethod');
        });

        it('should return undefined when metadata does not exist', () => {
            jest.spyOn(Reflect, 'getMetadata').mockReturnValue(undefined);

            const result = Metadata.getMethod(testKey, new TestClass(), 'myMethod');

            expect(result).toBeUndefined();
        });
    });

    describe('has', () => {
        it('should return true when metadata exists', () => {
            const spy = jest.spyOn(Reflect, 'hasMetadata').mockReturnValue(true);

            const result = Metadata.has(testKey, new TestClass());

            expect(result).toBe(true);
            expect(spy).toHaveBeenCalledWith(testKey.value, TestClass);
        });

        it('should return false when metadata does not exist', () => {
            jest.spyOn(Reflect, 'hasMetadata').mockReturnValue(false);

            const result = Metadata.has(testKey, new TestClass());

            expect(result).toBe(false);
        });
    });

    describe('hasMethod', () => {
        it('should return true when metadata exists for method', () => {
            const spy = jest.spyOn(Reflect, 'hasMetadata').mockReturnValue(true);

            const result = Metadata.hasMethod(testKey, new TestClass(), 'myMethod');

            expect(result).toBe(true);
            expect(spy).toHaveBeenCalledWith(testKey.value, TestClass, 'myMethod');
        });

        it('should return false when metadata does not exist for method', () => {
            jest.spyOn(Reflect, 'hasMetadata').mockReturnValue(false);

            const result = Metadata.hasMethod(testKey, new TestClass(), 'myMethod');

            expect(result).toBe(false);
        });
    });
});
