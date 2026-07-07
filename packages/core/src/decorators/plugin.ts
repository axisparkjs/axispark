import { MetadataKeys, Compose } from '@axisparkjs/common';

export function Plugin(): ClassDecorator {
    return Compose(MetadataKeys.CONSTRUCTABLE, MetadataKeys.INJECTABLE, MetadataKeys.PLUGIN);
}
