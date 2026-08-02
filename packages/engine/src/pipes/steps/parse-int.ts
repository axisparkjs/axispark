import { PipeStep } from '../pipe-step';
import { PipeStepExecutionContext } from '../pipe-step-execution-context';
import { PipeStepParameters } from '../pipe-step-parameters';
import { Injectable } from '@axisparkjs/di';
import { PipeStepParsingError } from '../pipe-step-errors';

export interface ParseIntPipeStepParameters extends PipeStepParameters {
    radix?: number;
}

@Injectable()
export class ParseIntPipeStep implements PipeStep<string, number> {
    execute(value: any, executionContext: PipeStepExecutionContext, parameters?: ParseIntPipeStepParameters): any {
        const radix = parameters?.radix ?? 10;
        const res = Number.parseInt(value, radix);
        if (Number.isNaN(res)) {
            throw new PipeStepParsingError(executionContext, `Value '${value}' is not a valid integer.`, 'integer');
        }
        return res;
    }
}

export const ParseInt = (radix?: number) => {
    return {
        pipeStep: ParseIntPipeStep,
        pipeStepParameters: { radix } as ParseIntPipeStepParameters
    };
};
