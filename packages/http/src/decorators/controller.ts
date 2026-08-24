import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { Constructable } from '@axisparkjs/di';
import { ControllerMetadata } from '../metadata/controller-metadata';

/**
 * A decorator for defining a controller with a specific prefix.
 * @param prefix The prefix for the controller routes.
 * @returns A class decorator.
 */
export function Controller(prefix: string | Omit<ControllerMetadata, 'target'> = ''): ClassDecorator {
    return (target) => {
        const metadata: ControllerMetadata = {
            target: Metadata.normalizeTarget(target),
            prefix: typeof prefix === 'string' ? prefix : prefix.prefix,
            version: typeof prefix === 'string' ? undefined : prefix.version
        };
        Constructable(MetadataKeys.INJECTABLE)(target);
        Metadata.define(MetadataKeys.CONTROLLER, metadata, target);
    };
}
