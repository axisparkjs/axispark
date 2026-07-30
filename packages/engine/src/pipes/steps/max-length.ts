import { PipeStep } from '../pipe-step';
import { PipeStepExecutionContext } from '../pipe-step-execution-context';
import { PipeStepParameters } from '../pipe-step-parameters';
import { Injectable } from '@axisparkjs/di';
import { PipeStepValidationError } from '../pipe-step-errors';

export interface MaxLengthPipeStepParameters extends PipeStepParameters {
    value: number;
}

@Injectable()
export class MaxLengthPipeStep implements PipeStep<string, string> {
    execute(value: any, executionContext: PipeStepExecutionContext, parameters: MaxLengthPipeStepParameters): any {
        if (value.length > parameters.value) {
            throw new PipeStepValidationError(executionContext, `Length must not exceed ${parameters.value}.`);
        }

        return value;
    }
}

export const MaxLength = (value: number) => {
    return {
        pipeStep: MaxLengthPipeStep,
        pipeStepParameters: { value } as MaxLengthPipeStepParameters
    };
};
