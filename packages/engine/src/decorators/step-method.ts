import { Metadata, MetadataKeys, ClassType } from '@axisparkjs/common';
import { StepMethodMetadata } from '../metadata';
import { StepType, StepScope } from '../step';

function StepMethod(metadata: Partial<StepMethodMetadata>): MethodDecorator {
    return (target, propertyKey) => {
        const stepMethods = Metadata.get<StepMethodMetadata[]>(MetadataKeys.STEP_METHOD, target) ?? [];
        stepMethods.push({
            target: Metadata.normalizeTarget(target),
            propertyKey,
            ...metadata
        } as StepMethodMetadata);

        Metadata.define(MetadataKeys.STEP_METHOD, stepMethods, target);
    };
}

export const Handle = () => StepMethod({ type: StepType.Middleware });
export const Check = () => StepMethod({ type: StepType.Guard });
export const Before = () => StepMethod({ type: StepType.Interceptor, scope: StepScope.Before });
export const After = () => StepMethod({ type: StepType.Interceptor, scope: StepScope.After });
export const Catch = (...acceptedErrors: ClassType<Error>[]) => StepMethod({ type: StepType.Filter, acceptedErrors });
