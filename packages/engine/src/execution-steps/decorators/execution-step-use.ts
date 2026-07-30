import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { Constructor } from '@axisparkjs/di';
import { ExecutionStepUseMetadata } from '../metadata/execution-step-use-metadata';

export function Use(...targets: Constructor[]): ClassDecorator & MethodDecorator {
    return (target: Function | object, propertyKey?: string | symbol, descriptor?: PropertyDescriptor) => {
        const metadata: ExecutionStepUseMetadata = {
            targets
        };

        // Método
        if (descriptor) {
            Metadata.defineMethod(MetadataKeys.EXECUTION_STEP_USE, metadata, target, propertyKey as string | symbol);
        }
        // Clase
        else {
            Metadata.define(MetadataKeys.EXECUTION_STEP_USE, metadata, target);
        }
    };
}
