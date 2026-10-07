import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { SecuredMetadata } from '../metadata/secured-metadata';

/**
 * A decorator for defining a class or a method as secured
 * @returns A class decorator.
 * @returns A method decorator.
 */
export function Secured(data: Pick<SecuredMetadata, 'policies'>): ClassDecorator & MethodDecorator {
    return (target: Function | object, propertyKey?: string | symbol, descriptor?: PropertyDescriptor) => {
        const metadata: SecuredMetadata = {
            target: Metadata.normalizeTarget(target),
            propertyKey,
            ...data
        };

        // Método
        if (descriptor) {
            Metadata.define(MetadataKeys.SECURED, metadata, target, propertyKey as string | symbol);
        }
        // Clase
        else {
            Metadata.define(MetadataKeys.SECURED, metadata, target);
        }
    };
}
