import { Constructable } from '@axisparkjs/di';
import { MetadataKeys } from '@axisparkjs/common';

export function Plugin(): ClassDecorator {
    return Constructable(MetadataKeys.INJECTABLE, MetadataKeys.PLUGIN);
}
