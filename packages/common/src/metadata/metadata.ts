import 'reflect-metadata';
import { MetadataKey } from './metadata-key';
import { ClassType } from '../types';

class MetadataStatic {
    define(key: MetadataKey, value: unknown, target: object, propertyKey?: string | symbol, normalizeTarget = true): void {
        if (propertyKey) Reflect.defineMetadata(key.value, value, normalizeTarget ? this.normalizeTarget(target) : target, propertyKey);
        else Reflect.defineMetadata(key.value, value, normalizeTarget ? this.normalizeTarget(target) : target);
    }
    get<T>(key: MetadataKey, target: object, propertyKey?: string | symbol, normalizeTarget = true): T | undefined {
        if (propertyKey) return Reflect.getMetadata(key.value, normalizeTarget ? this.normalizeTarget(target) : target, propertyKey);
        return Reflect.getMetadata(key.value, normalizeTarget ? this.normalizeTarget(target) : target);
    }
    has(key: MetadataKey, target: object, propertyKey?: string | symbol, normalizeTarget = true): boolean {
        if (propertyKey) return Reflect.hasMetadata(key.value, normalizeTarget ? this.normalizeTarget(target) : target, propertyKey);
        return Reflect.hasMetadata(key.value, normalizeTarget ? this.normalizeTarget(target) : target);
    }
    normalizeTarget(target: object): ClassType {
        return (typeof target === 'function' ? target : target.constructor) as ClassType;
    }
}

export const Metadata = new MetadataStatic();
