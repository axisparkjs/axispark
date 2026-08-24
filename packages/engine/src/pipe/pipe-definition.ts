import { ClassType } from '@axisparkjs/common';
import { ParameterDefinition } from '../parameter';
import { PipeStep, PipeStepConfig } from './pipe-step';

/**
 * A definition for a pipe that consists of a parameter and an array of pipe steps.
 * It encapsulates the parameter to be processed and the sequence of pipe steps to be applied to it.
 */
export class PipeDefinition {
    constructor(
        public readonly parameter: ParameterDefinition,
        public readonly steps: { pipeStep: ClassType<PipeStep>; pipeStepConfig?: PipeStepConfig }[]
    ) {}
}
