import { Metadata, MetadataKey } from '../metadata';

export function Compose(...metadataKeys: MetadataKey[]): ClassDecorator {
    return (target) => {
        for (const key of metadataKeys) {
            Metadata.define(key, true, target);
        }
    };
}
