import { Metadata, MetadataKeys, ClassType } from '@axisparkjs/common';
import { StepMethodMetadata } from '../metadata';
import { StepType, StepScope } from '../step';

/**
 * A decorator for defining step methods.
 * @param metadata The metadata for the step method.
 * @returns A step method decorator.
 */
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

/**
 * A decorator for defining middleware step methods.
 * @returns A middleware step method decorator.
 */
export const Handle = () => StepMethod({ type: StepType.Middleware });
/**
 * A decorator for defining guard step methods.
 * @returns A guard step method decorator.
 */
export const Check = () => StepMethod({ type: StepType.Guard });
/**
 * A decorator for defining before interceptor step methods.
 * @returns An interceptor step method decorator.
 */
export const Before = () => StepMethod({ type: StepType.Interceptor, scope: StepScope.Before });
/**
 * A decorator for defining after interceptor step methods.
 * @returns An interceptor step method decorator.
 */
export const After = () => StepMethod({ type: StepType.Interceptor, scope: StepScope.After });
/**
 * A decorator for defining filter step methods that catch specific errors.
 * @param acceptedErrors The error types to catch.
 * @returns A filter step method decorator.
 */
export const Catch = (...acceptedErrors: ClassType<Error>[]) => StepMethod({ type: StepType.Filter, acceptedErrors });
