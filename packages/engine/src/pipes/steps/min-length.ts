import { PipeStep } from '../pipe-step';
import { PipeStepExecutionContext } from '../pipe-step-execution-context';
import { PipeStepParameters } from '../pipe-step-parameters';
import { Injectable } from '@axisparkjs/di';
import { PipeStepValidationError } from '../pipe-step-errors';

export interface MinLengthPipeStepParameters extends PipeStepParameters {
    value: number;
}

@Injectable()
export class MinLengthPipeStep implements PipeStep<string, string> {
    execute(value: any, executionContext: PipeStepExecutionContext, parameters: MinLengthPipeStepParameters): any {
        if (value.length < parameters.value) {
            throw new PipeStepValidationError(executionContext, `Length must be at least ${parameters.value}.`);
        }

        return value;
    }
}

export const MinLength = (value: number) => {
    return {
        pipeStep: MinLengthPipeStep,
        pipeStepParameters: { value } as MinLengthPipeStepParameters
    };
};
