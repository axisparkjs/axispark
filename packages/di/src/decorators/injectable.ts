import { Constructable } from './constructable';
import { MetadataKeys } from '@axisparkjs/common';

export function Injectable(): ClassDecorator {
    return Constructable(MetadataKeys.INJECTABLE);
}
