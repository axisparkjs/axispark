import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { Constructable } from '@axisparkjs/di';
import { StepTargetMetadata } from '../metadata';
import { StepType, StepPriority } from '../step';
import { ExecutionTransport } from '../execution';

function StepTarget(config: Partial<StepTargetMetadata>): ClassDecorator {
    return (target) => {
        const stepTargets = Metadata.get<StepTargetMetadata[]>(MetadataKeys.STEP_TARGET, target) ?? [];
        stepTargets.push({
            target: Metadata.normalizeTarget(target),
            type: config.type as StepType,
            transport: config.transport ?? ExecutionTransport.All,
            global: config.global ?? false,
            priority: config.priority ?? StepPriority.Normal
        });

        Constructable(MetadataKeys.INJECTABLE)(target);
        Metadata.define(MetadataKeys.STEP_TARGET, stepTargets, target);
    };
}

type StepTargetConfig = Partial<Omit<StepTargetMetadata, 'type'>>;

export const Middleware = (config?: StepTargetConfig) => StepTarget({ ...config, type: StepType.Middleware });
export const Guard = (config?: StepTargetConfig) => StepTarget({ ...config, type: StepType.Guard });
export const Interceptor = (config?: StepTargetConfig) => StepTarget({ ...config, type: StepType.Interceptor });
export const Filter = (config?: StepTargetConfig) => StepTarget({ ...config, type: StepType.Filter });
