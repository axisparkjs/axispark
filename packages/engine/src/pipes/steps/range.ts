import { PipeStep } from '../pipe-step';
import { PipeStepExecutionContext } from '../pipe-step-execution-context';
import { PipeStepParameters } from '../pipe-step-parameters';
import { Injectable } from '@axisparkjs/di';
import { PipeStepValidationError } from '../pipe-step-errors';

export interface RangePipeStepParameters extends PipeStepParameters {
    min: number;
    max: number;
}

@Injectable()
export class RangePipeStep implements PipeStep<number, number> {
    execute(value: any, executionContext: PipeStepExecutionContext, parameters: RangePipeStepParameters): any {
        if (value < parameters.min || value > parameters.max) {
            throw new PipeStepValidationError(executionContext, `Value must be between ${parameters.min} and ${parameters.max}.`);
        }

        return value;
    }
}

export const Range = (min: number, max: number) => {
    return {
        pipeStep: RangePipeStep,
        pipeStepParameters: { min, max } as RangePipeStepParameters
    };
};
