import { Executable } from '@axisparkjs/common';
import { PipeStepParameters } from './pipe-step-parameters';
import { PipeStepExecutionContext } from './pipe-step-execution-context';

export interface PipeStep<I = unknown, O = I> extends Executable {
    execute(value: I, executionContext: PipeStepExecutionContext, params?: PipeStepParameters): O | Promise<O>;
}
export type PipeStepClass<T extends PipeStep = PipeStep> = new (...args: any[]) => T;
