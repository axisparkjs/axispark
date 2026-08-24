import { Generator, Metadata, MetadataKeys, ClassType } from '@axisparkjs/common';
import { ClassRegistry, Injectable } from '@axisparkjs/di';
import { ExecutionContext } from '../execution';
import { StepDefinition } from './step-definition';
import { StepMethodMetadata, StepTargetMetadata, UseMetadata } from '../metadata';

/**
 * A generator for creating step definitions based on metadata.
 */
@Injectable()
export class StepGenerator implements Generator<StepDefinition[]> {
    private readonly globalSteps: StepDefinition[] = [];

    /**
     * Generates step definitions based on the provided execution context.
     * @param context The execution context containing relevant information for step generation.
     * @returns An array of generated step definitions.
     */
    public generate(context: ExecutionContext): StepDefinition[] {
        const globalSteps = this.buildGlobalSteps();
        const steps = this.getTargets(context).flatMap((target) => this.buildSteps(target, false));

        return [...globalSteps, ...steps];
    }

    private buildGlobalSteps(): StepDefinition[] {
        if (this.globalSteps.length > 0) return this.globalSteps;

        for (const target of ClassRegistry.getWithMetadata(MetadataKeys.STEP_TARGET)) {
            this.globalSteps.push(...this.buildSteps(target, true));
        }
        return this.globalSteps;
    }

    private getTargets(context: ExecutionContext): ClassType[] {
        const classMetadata = Metadata.get<UseMetadata>(MetadataKeys.USE, context.target);
        const methodMetadata = Metadata.get<UseMetadata>(MetadataKeys.USE, context.target, context.propertyKey);

        return [...(classMetadata?.targets ?? []), ...(methodMetadata?.targets ?? [])];
    }

    private buildSteps(target: ClassType, global: boolean): StepDefinition[] {
        const targetMetadatas = Metadata.get<StepTargetMetadata[]>(MetadataKeys.STEP_TARGET, target) ?? [];
        const methodMetadatas = Metadata.get<StepMethodMetadata[]>(MetadataKeys.STEP_METHOD, target) ?? [];

        const steps: StepDefinition[] = [];
        for (const tagetMetadata of targetMetadatas) {
            if (tagetMetadata.global !== global) continue;

            for (const methodMetadata of methodMetadatas) {
                if (methodMetadata.type !== tagetMetadata.type) continue;

                steps.push(StepDefinition.fromMetadata(methodMetadata, tagetMetadata));
            }
        }

        return steps;
    }
}
