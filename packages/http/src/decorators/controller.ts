import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { Constructable } from '@axisparkjs/di';
import { ControllerMetadata } from '../metadata/controller-metadata';

export function Controller(prefix: string | ControllerMetadata = ''): ClassDecorator {
    return (target) => {
        const metadata: ControllerMetadata = typeof prefix === 'string' ? { prefix } : prefix;
        Constructable(MetadataKeys.INJECTABLE)(target);
        Metadata.define(MetadataKeys.CONTROLLER, metadata, target);
    };
}
