import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { Constructable } from '@axisparkjs/di';

export function Scheduler(): ClassDecorator {
    return (target) => {
        Constructable(MetadataKeys.INJECTABLE)(target);
        Metadata.define(MetadataKeys.SCHEDULER, true, target);
    };
}
