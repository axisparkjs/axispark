import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { Constructable } from '@axisparkjs/di';
import { ControllerMetadata } from '../metadata/controller-metadata';

export function Controller(prefix = ''): ClassDecorator {
    return (target) => {
        const metadata: ControllerMetadata = {
            prefix
        };
        Constructable(MetadataKeys.INJECTABLE)(target);
        Metadata.define(MetadataKeys.CONTROLLER, metadata, target);
    };
}
