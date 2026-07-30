import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { Constructor } from '@axisparkjs/di';
import { ExecutionStepMethodMetadata } from '../metadata/execution-step-method-metadata';
import { ExecutionStepType } from '../execution-step-type';
import { ExecutionStepScope } from '../execution-step-scope';
import { ErrorClass } from '../types';

function ExecutionStepMethod(config: any): MethodDecorator {
    return (target, propertyKey) => {
        const executionStepMethods = Metadata.get<ExecutionStepMethodMetadata[]>(MetadataKeys.EXECUTION_STEP_METHOD, target) ?? [];
        executionStepMethods.push({
            ...config,
            target: target.constructor as Constructor,
            propertyKey
        } as ExecutionStepMethodMetadata);

        Metadata.define(MetadataKeys.EXECUTION_STEP_METHOD, executionStepMethods, target);
    };
}

export const Handle = () => ExecutionStepMethod({ type: ExecutionStepType.Middleware });
export const Check = () => ExecutionStepMethod({ type: ExecutionStepType.Guard });
export const Before = () => ExecutionStepMethod({ type: ExecutionStepType.Interceptor, scope: ExecutionStepScope.Before });
export const After = () => ExecutionStepMethod({ type: ExecutionStepType.Interceptor, scope: ExecutionStepScope.After });
export const Catch = (...acceptedErrors: ErrorClass[]) => ExecutionStepMethod({ type: ExecutionStepType.Filter, acceptedErrors });
