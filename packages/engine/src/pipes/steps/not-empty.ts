import { PipeStep } from '../pipe-step';
import { PipeStepExecutionContext } from '../pipe-step-execution-context';
import { Injectable } from '@axisparkjs/di';
import { PipeStepValidationError } from '../pipe-step-errors';

@Injectable()
export class NotEmptyPipeStep implements PipeStep<string, string> {
    execute(value: any, executionContext: PipeStepExecutionContext): any {
        if (value === undefined || value === null || value === '') {
            throw new PipeStepValidationError(executionContext, `Value must not be empty.`);
        }

        return value;
    }
}

export const NotEmpty = () => NotEmptyPipeStep;
