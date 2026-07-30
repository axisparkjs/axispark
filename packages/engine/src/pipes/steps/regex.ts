import { PipeStep } from '../pipe-step';
import { PipeStepExecutionContext } from '../pipe-step-execution-context';
import { PipeStepParameters } from '../pipe-step-parameters';
import { Injectable } from '@axisparkjs/di';
import { PipeStepValidationError } from '../pipe-step-errors';

export interface RegexPipeStepParameters extends PipeStepParameters {
    pattern: RegExp;
}

@Injectable()
export class RegexPipeStep implements PipeStep<string, string> {
    execute(value: any, executionContext: PipeStepExecutionContext, parameters: RegexPipeStepParameters): any {
        if (!parameters.pattern.test(value)) {
            throw new PipeStepValidationError(executionContext, `Value does not match the expected format (${parameters.pattern.toString()}).`);
        }

        return value;
    }
}

export const Regex = (pattern: RegExp) => {
    return {
        pipeStep: RegexPipeStep,
        pipeStepParameters: { pattern } as RegexPipeStepParameters
    };
};
