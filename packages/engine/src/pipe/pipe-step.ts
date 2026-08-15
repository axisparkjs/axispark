import { Executable } from '@axisparkjs/common';
import { ParameterDefinition } from '../parameter';

export type PipeStepConfig = Record<string, unknown>;

export interface PipeStep<I = unknown, O = I> extends Executable {
    execute(parameter: ParameterDefinition, config?: PipeStepConfig): O | Promise<O>;
}
