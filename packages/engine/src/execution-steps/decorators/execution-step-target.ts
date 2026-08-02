import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { Constructable } from '@axisparkjs/di';
import { ExecutionStepTargetMetadata } from '../metadata/execution-step-target-metadata';
import { ExecutionStepType } from '../execution-step-type';
import { ExecutionTransport, ExecutionPriority } from '../../execution';

function ExecutionStepTarget(config: Partial<ExecutionStepTargetMetadata>): ClassDecorator {
    return (target) => {
        const executionStepTargets = Metadata.get<ExecutionStepTargetMetadata[]>(MetadataKeys.EXECUTION_STEP_TARGET, target) ?? [];
        executionStepTargets.push({
            type: config.type as ExecutionStepType,
            transport: config.transport ?? ExecutionTransport.All,
            global: config.global ?? false,
            priority: config.priority ?? ExecutionPriority.Normal
        });

        Constructable(MetadataKeys.INJECTABLE)(target);
        Metadata.define(MetadataKeys.EXECUTION_STEP_TARGET, executionStepTargets, target);
    };
}

type ExecutionStepTargetConfig = Partial<Omit<ExecutionStepTargetMetadata, 'type'>>;

export const Middleware = (config?: ExecutionStepTargetConfig) => ExecutionStepTarget({ ...config, type: ExecutionStepType.Middleware });
export const Guard = (config?: ExecutionStepTargetConfig) => ExecutionStepTarget({ ...config, type: ExecutionStepType.Guard });
export const Interceptor = (config?: ExecutionStepTargetConfig) => ExecutionStepTarget({ ...config, type: ExecutionStepType.Interceptor });
export const Filter = (config?: ExecutionStepTargetConfig) => ExecutionStepTarget({ ...config, type: ExecutionStepType.Filter });
