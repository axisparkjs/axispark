import { Generator, Initializable, Metadata, MetadataKeys } from '@axisparkjs/common';
import { ClassRegistry, Constructor } from '@axisparkjs/di';
import { ExecutionHandler } from '../execution/execution-handler';
import { ExecutionStep } from './execution-step';
import { ExecutionStepMethodMetadata } from './metadata/execution-step-method-metadata';
import { ExecutionStepTargetMetadata } from './metadata/execution-step-target-metadata';
import { ExecutionStepUseMetadata } from './metadata/execution-step-use-metadata';

class ExecutionStepsGeneratorStatic implements Generator<ExecutionStep[]>, Initializable {
    private readonly globalSteps: ExecutionStep[] = [];

    public init(): void {
        this.globalSteps.length = 0;

        for (const target of ClassRegistry.getWithMetadata(MetadataKeys.EXECUTION_STEP_TARGET)) {
            this.globalSteps.push(...this.buildSteps(target, true));
        }
    }

    public generate(handler: ExecutionHandler): ExecutionStep[] {
        const steps = this.getTargets(handler).flatMap((target) => this.buildSteps(target, false));

        return [...this.globalSteps, ...steps];
    }

    private getTargets(handler: ExecutionHandler): Constructor[] {
        const classMetadata = Metadata.get<ExecutionStepUseMetadata>(MetadataKeys.EXECUTION_STEP_USE, handler.target);

        const methodMetadata = Metadata.getMethod<ExecutionStepUseMetadata>(MetadataKeys.EXECUTION_STEP_USE, handler.target, handler.method);

        return [...(classMetadata?.targets ?? []), ...(methodMetadata?.targets ?? [])];
    }

    private buildSteps(target: Constructor, global: boolean): ExecutionStep[] {
        const targetMetadata = Metadata.get<ExecutionStepTargetMetadata[]>(MetadataKeys.EXECUTION_STEP_TARGET, target) ?? [];

        const methodMetadata = Metadata.get<ExecutionStepMethodMetadata[]>(MetadataKeys.EXECUTION_STEP_METHOD, target) ?? [];

        const steps: ExecutionStep[] = [];

        for (const metadata of targetMetadata) {
            if (metadata.global !== global) {
                continue;
            }

            for (const method of methodMetadata) {
                if (method.type !== metadata.type) {
                    continue;
                }

                steps.push({
                    ...method,
                    global,
                    transport: metadata.transport,
                    priority: global ? metadata.priority : 0
                });
            }
        }

        return steps;
    }
}

export const ExecutionStepsGenerator = new ExecutionStepsGeneratorStatic();
