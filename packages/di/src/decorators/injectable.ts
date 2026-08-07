import { InjectableMetadata } from '@axisparkjs/di/src/metadata';
import { Constructable } from './constructable';
import { InjectableScope } from '../types';
import { Metadata, MetadataKeys } from '@axisparkjs/common';

export function Injectable(metadata?: InjectableMetadata): ClassDecorator {
    return (target) => {
        metadata = {
            scope: InjectableScope.Singleton,
            ...metadata
        };

        Constructable(MetadataKeys.INJECTABLE)(target);
        Metadata.define(MetadataKeys.INJECTABLE, metadata, target);
    };
}
