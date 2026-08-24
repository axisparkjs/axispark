import { Metadata, MetadataKey, MetadataKeys } from '@axisparkjs/common';
import { ClassRegistry } from '../registry';

/**
 * A decorator that marks a class as constructable, allowing it to be instantiated by the dependency injection container.
 * @param metadataKeys - An array of metadata keys to define on the class.
 * @returns A class decorator.
 */
export function Constructable(...metadataKeys: MetadataKey[]): ClassDecorator {
    return (target: any) => {
        ClassRegistry.register(target);
        Metadata.define(MetadataKeys.CONSTRUCTABLE, true, target);
        for (const key of metadataKeys) {
            Metadata.define(key, true, target);
        }
    };
}
