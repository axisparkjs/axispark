import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { Constructable } from '@axisparkjs/di';
import { SchedulerMetadata } from '../metadata';

export function Scheduler(): ClassDecorator {
    return (target) => {
        const metadata: SchedulerMetadata = { target: Metadata.normalizeTarget(target) };
        Constructable(MetadataKeys.INJECTABLE)(target);
        Metadata.define(MetadataKeys.SCHEDULER, metadata, target);
    };
}
