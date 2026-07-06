import { MetadataKey } from './metadata-key';

export class MetadataStatic {
    define(key: MetadataKey, value: unknown, target: object): void {
        Reflect.defineMetadata(key.value, value, target);
    }
    defineMethod(key: MetadataKey, value: unknown, target: object, propertyKey: string | symbol): void {
        Reflect.defineMetadata(key.value, value, target, propertyKey);
    }
    get<T>(key: MetadataKey, target: object): T | undefined {
        return Reflect.getMetadata(key.value, target);
    }
    getMethod<T>(key: MetadataKey, target: object, propertyKey: string | symbol): T | undefined {
        return Reflect.getMetadata(key.value, target, propertyKey);
    }
    has(key: MetadataKey, target: object): boolean {
        return Reflect.hasMetadata(key.value, target);
    }
    hasMethod(key: MetadataKey, target: object, propertyKey: string | symbol): boolean {
        return Reflect.hasMetadata(key.value, target, propertyKey);
    }
}

export const Metadata = new MetadataStatic();
