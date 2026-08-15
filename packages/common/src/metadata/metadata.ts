import 'reflect-metadata';
import { MetadataKey } from './metadata-key';
import { ClassType } from '../types';

class MetadataStatic {
    define(key: MetadataKey, value: unknown, target: object, propertyKey?: string | symbol): void {
        if (propertyKey) Reflect.defineMetadata(key.value, value, this.normalizeTarget(target), propertyKey);
        else Reflect.defineMetadata(key.value, value, this.normalizeTarget(target));
    }
    get<T>(key: MetadataKey, target: object, propertyKey?: string | symbol): T | undefined {
        if (propertyKey) return Reflect.getMetadata(key.value, this.normalizeTarget(target), propertyKey);
        return Reflect.getMetadata(key.value, this.normalizeTarget(target));
    }
    has(key: MetadataKey, target: object, propertyKey?: string | symbol): boolean {
        if (propertyKey) return Reflect.hasMetadata(key.value, this.normalizeTarget(target), propertyKey);
        return Reflect.hasMetadata(key.value, this.normalizeTarget(target));
    }
    normalizeTarget(target: object): ClassType {
        return (typeof target === 'function' ? target : target.constructor) as ClassType;
    }
}

export const Metadata = new MetadataStatic();
