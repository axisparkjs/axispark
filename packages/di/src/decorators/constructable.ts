import { Metadata, MetadataKey, MetadataKeys } from '@axisparkjs/common';
import { registry } from '../registry';

export function Constructable(...metadataKeys: MetadataKey[]): ClassDecorator {
    return (target: any) => {
        registry.set(target.name, target);
        Metadata.define(MetadataKeys.CONSTRUCTABLE, true, target);
        for (const key of metadataKeys) {
            Metadata.define(key, true, target);
        }
    };
}