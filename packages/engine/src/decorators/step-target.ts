import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { Constructable } from '@axisparkjs/di';
import { StepTargetMetadata } from '../metadata';
import { StepType, StepPriority } from '../step';
import { ExecutionTransport } from '../execution';

/**
 * A decorator for defining step targets
 * @param config The configuration for the step target.
 * @returns A step target decorator.
 */
function StepTarget(config: Partial<StepTargetMetadata>): ClassDecorator {
    return (target) => {
        const stepTargets = Metadata.get<StepTargetMetadata[]>(MetadataKeys.STEP_TARGET, target) ?? [];
        stepTargets.push({
            target: Metadata.normalizeTarget(target),
            type: config.type as StepType,
            transport: config.transport ?? ExecutionTransport.All,
            global: config.global ?? true,
            priority: config.priority ?? StepPriority.Normal
        });

        Constructable(MetadataKeys.INJECTABLE)(target);
        Metadata.define(MetadataKeys.STEP_TARGET, stepTargets, target);
    };
}

type StepTargetConfig = Partial<Omit<StepTargetMetadata, 'type'>>;

/**
 * A decorator for defining middleware step targets.
 * @param config The configuration for the step target.
 * @returns A step target decorator.
 */
export const Middleware = (config?: StepTargetConfig) => StepTarget({ ...config, type: StepType.Middleware });
/**
 * A decorator for defining guard step targets.
 * @param config The configuration for the step target.
 * @returns A step target decorator.
 */
export const Guard = (config?: StepTargetConfig) => StepTarget({ ...config, type: StepType.Guard });
/**
 * A decorator for defining interceptor step targets.
 * @param config The configuration for the step target.
 * @returns A step target decorator.
 */
export const Interceptor = (config?: StepTargetConfig) => StepTarget({ ...config, type: StepType.Interceptor });
/**
 * A decorator for defining filter step targets.
 * @param config The configuration for the step target.
 * @returns A step target decorator.
 */
export const Filter = (config?: StepTargetConfig) => StepTarget({ ...config, type: StepType.Filter });
