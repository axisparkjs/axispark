import { Metadata, MetadataKey, MetadataKeys } from '@axisparkjs/common';
import { ClassRegistry } from '../class-registry';

export function Constructable(...metadataKeys: MetadataKey[]): ClassDecorator {
    return (target: any) => {
        ClassRegistry.register(target);
        Metadata.define(MetadataKeys.CONSTRUCTABLE, true, target);
        for (const key of metadataKeys) {
            Metadata.define(key, true, target);
        }
    };
}
