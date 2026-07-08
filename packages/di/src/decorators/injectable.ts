import { MetadataKeys, Compose } from '@axisparkjs/common';

export function Injectable(): ClassDecorator {
    return Compose(MetadataKeys.CONSTRUCTABLE, MetadataKeys.INJECTABLE);
}
