import 'reflect-metadata';
import { MetadataKey } from './metadata-key';

class MetadataStatic {
    define(key: MetadataKey, value: unknown, target: object): void {
        Reflect.defineMetadata(key.value, value, this.normalizeTarget(target));
    }
    defineMethod(key: MetadataKey, value: unknown, target: object, propertyKey: string | symbol): void {
        Reflect.defineMetadata(key.value, value, this.normalizeTarget(target), propertyKey);
    }
    defineProperty(key: MetadataKey, value: unknown, target: object, propertyKey: string | symbol): void {
        Reflect.defineMetadata(key.value, value, target, propertyKey);
    }
    get<T>(key: MetadataKey, target: object): T | undefined {
        return Reflect.getMetadata(key.value, this.normalizeTarget(target));
    }
    getMethod<T>(key: MetadataKey, target: object, propertyKey: string | symbol): T | undefined {
        return Reflect.getMetadata(key.value, this.normalizeTarget(target), propertyKey);
    }
    getProperty<T>(key: MetadataKey, target: object, propertyKey: string | symbol): T | undefined {
        return Reflect.getMetadata(key.value, target, propertyKey);
    }
    has(key: MetadataKey, target: object): boolean {
        return Reflect.hasMetadata(key.value, this.normalizeTarget(target));
    }
    hasMethod(key: MetadataKey, target: object, propertyKey: string | symbol): boolean {
        return Reflect.hasMetadata(key.value, this.normalizeTarget(target), propertyKey);
    }
    hasProperty(key: MetadataKey, target: object, propertyKey: string | symbol): boolean {
        return Reflect.hasMetadata(key.value, target, propertyKey);
    }
    private normalizeTarget(target: object): object {
        return typeof target === 'function' ? target : target.constructor;
    }
}

export const Metadata = new MetadataStatic();
