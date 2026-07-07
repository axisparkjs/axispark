import { Metadata } from './metadata';
import { MetadataKey } from './metadata-key';

describe('Metadata', () => {
    const testKey: MetadataKey = new MetadataKey('test-key');

    beforeEach(() => {
        jest.restoreAllMocks();
    });

    describe('define', () => {
        it('should call Reflect.defineMetadata', () => {
            const spy = jest.spyOn(Reflect, 'defineMetadata').mockImplementation();

            const key = testKey;
            const value = { foo: 'bar' };
            const target = {};

            Metadata.define(key, value, target);

            expect(spy).toHaveBeenCalledWith(key.value, value, target);
        });
    });

    describe('defineMethod', () => {
        it('should call Reflect.defineMetadata with method name', () => {
            const spy = jest.spyOn(Reflect, 'defineMetadata').mockImplementation();

            const key = testKey;
            const value = { foo: 'bar' };
            const target = {};
            const methodName = 'myMethod';

            Metadata.defineMethod(key, value, target, methodName);

            expect(spy).toHaveBeenCalledWith(key.value, value, target, methodName);
        });
    });

    describe('get', () => {
        it('should return metadata from Reflect.getMetadata', () => {
            const expected = { foo: 'bar' };
            const spy = jest.spyOn(Reflect, 'getMetadata').mockReturnValue(expected);

            const key = testKey;
            const target = {};

            const result = Metadata.get(key, target);

            expect(result).toBe(expected);
            expect(spy).toHaveBeenCalledWith(key.value, target);
        });

        it('should return undefined when metadata does not exist', () => {
            jest.spyOn(Reflect, 'getMetadata').mockReturnValue(undefined);

            const result = Metadata.get(testKey, {});

            expect(result).toBeUndefined();
        });
    });

    describe('getMethod', () => {
        it('should return metadata from Reflect.getMetadata with method name', () => {
            const expected = { foo: 'bar' };
            const spy = jest.spyOn(Reflect, 'getMetadata').mockReturnValue(expected);

            const key = testKey;
            const target = {};
            const methodName = 'myMethod';

            const result = Metadata.getMethod(key, target, methodName);

            expect(result).toBe(expected);
            expect(spy).toHaveBeenCalledWith(key.value, target, methodName);
        });

        it('should return undefined when metadata does not exist', () => {
            jest.spyOn(Reflect, 'getMetadata').mockReturnValue(undefined);

            const result = Metadata.getMethod(testKey, {}, 'myMethod');

            expect(result).toBeUndefined();
        });
    });

    describe('has', () => {
        it('should return true when metadata exists', () => {
            const spy = jest.spyOn(Reflect, 'hasMetadata').mockReturnValue(true);

            const key = testKey;
            const target = {};

            const result = Metadata.has(key, target);

            expect(result).toBe(true);
            expect(spy).toHaveBeenCalledWith(key.value, target);
        });

        it('should return false when metadata does not exist', () => {
            jest.spyOn(Reflect, 'hasMetadata').mockReturnValue(false);

            const result = Metadata.has(testKey, {});

            expect(result).toBe(false);
        });
    });

    describe('hasMethod', () => {
        it('should return true when metadata exists for method', () => {
            const spy = jest.spyOn(Reflect, 'hasMetadata').mockReturnValue(true);

            const key = testKey;
            const target = {};
            const methodName = 'myMethod';

            const result = Metadata.hasMethod(key, target, methodName);

            expect(result).toBe(true);
            expect(spy).toHaveBeenCalledWith(key.value, target, methodName);
        });

        it('should return false when metadata does not exist for method', () => {
            jest.spyOn(Reflect, 'hasMetadata').mockReturnValue(false);

            const result = Metadata.hasMethod(testKey, {}, 'myMethod');

            expect(result).toBe(false);
        });
    });
});
