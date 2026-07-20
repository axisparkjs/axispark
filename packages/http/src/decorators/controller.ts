import { Metadata } from '@axisparkjs/common/src';
import { MetadataKeys } from '@axisparkjs/common/src';
import { Constructor } from '@axisparkjs/di';

import { ControllerMetadata } from '../metadata/controller-metadata';
import { Compose } from '@axisparkjs/common/decorators/compose';

export function Controller(prefix = ''): ClassDecorator {
    return (target) => {
        const metadata: ControllerMetadata = {
            prefix
        };
        Compose(MetadataKeys.CONSTRUCTABLE, MetadataKeys.INJECTABLE)(target);
        Metadata.define(MetadataKeys.CONTROLLER, metadata, target as unknown as Constructor);
    };
}
