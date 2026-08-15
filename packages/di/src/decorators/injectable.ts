import { InjectableMetadata } from '@axisparkjs/di/src/metadata';
import { Constructable } from './constructable';
import { Metadata, MetadataKeys } from '@axisparkjs/common';

export function Injectable(): ClassDecorator {
    return (target) => {
        const metadata: InjectableMetadata = {
            target: Metadata.normalizeTarget(target)
        };

        Constructable(MetadataKeys.INJECTABLE)(target);
        Metadata.define(MetadataKeys.INJECTABLE, metadata, target);
    };
}
