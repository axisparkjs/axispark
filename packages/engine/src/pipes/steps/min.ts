import { PipeStep } from '../pipe-step';
import { PipeStepExecutionContext } from '../pipe-step-execution-context';
import { PipeStepParameters } from '../pipe-step-parameters';
import { Injectable } from '@axisparkjs/di';
import { PipeStepValidationError } from '../pipe-step-errors';

export interface MinPipeStepParameters extends PipeStepParameters {
    value: number;
}

@Injectable()
export class MinPipeStep implements PipeStep<number, number> {
    execute(value: any, executionContext: PipeStepExecutionContext, parameters: MinPipeStepParameters): any {
        if (value < parameters.value) {
            throw new PipeStepValidationError(executionContext, `Value must be greater than or equal to ${parameters.value}.`);
        }

        return value;
    }
}

export const Min = (value: number) => {
    return {
        pipeStep: MinPipeStep,
        pipeStepParameters: { value } as MinPipeStepParameters
    };
};
