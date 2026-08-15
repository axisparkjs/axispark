import { ClassType } from '@axisparkjs/common';
import { ParameterDefinition } from '../parameter';
import { PipeStep, PipeStepConfig } from './pipe-step';

export class PipeDefinition {
    constructor(
        public readonly parameter: ParameterDefinition,
        public readonly steps: { pipeStep: ClassType<PipeStep>; pipeStepConfig?: PipeStepConfig }[]
    ) {}
}
