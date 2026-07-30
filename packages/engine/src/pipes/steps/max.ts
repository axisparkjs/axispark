import { PipeStep } from '../pipe-step';
import { PipeStepExecutionContext } from '../pipe-step-execution-context';
import { PipeStepParameters } from '../pipe-step-parameters';
import { Injectable } from '@axisparkjs/di';
import { PipeStepValidationError } from '../pipe-step-errors';

export interface MaxPipeStepParameters extends PipeStepParameters {
    value: number;
}

@Injectable()
export class MaxPipeStep implements PipeStep<number, number> {
    execute(value: any, executionContext: PipeStepExecutionContext, parameters: MaxPipeStepParameters): any {
        if (value > parameters.value) {
            throw new PipeStepValidationError(executionContext, `Value must be less than or equal to ${parameters.value}.`);
        }

        return value;
    }
}

export const Max = (value: number) => {
    return {
        pipeStep: MaxPipeStep,
        pipeStepParameters: { value } as MaxPipeStepParameters
    };
};
