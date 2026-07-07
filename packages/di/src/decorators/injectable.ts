import { MetadataKeys } from '@axisparkjs/common';
import { Compose } from '@axisparkjs/common';

export function Injectable(): ClassDecorator {
    return Compose(MetadataKeys.CONSTRUCTABLE, MetadataKeys.INJECTABLE);
}
