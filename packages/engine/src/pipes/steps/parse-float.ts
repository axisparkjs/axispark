import { PipeStep } from '../pipe-step';
import { PipeStepExecutionContext } from '../pipe-step-execution-context';
import { Injectable } from '@axisparkjs/di';
import { PipeStepParsingError } from '../pipe-step-errors';

@Injectable()
export class ParseFloatPipeStep implements PipeStep<string, number> {
    execute(value: any, executionContext: PipeStepExecutionContext): any {
        const res = parseFloat(value);

        if (isNaN(res)) {
            throw new PipeStepParsingError(executionContext, `Value '${value}' is not a valid number.`, 'float');
        }

        return res;
    }
}

export const ParseFloat = () => ParseFloatPipeStep;
