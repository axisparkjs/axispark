import { PipeStep } from '../pipe-step';
import { PipeStepExecutionContext } from '../pipe-step-execution-context';
import { Injectable } from '@axisparkjs/di';
import { PipeStepParsingError } from '../pipe-step-errors';

@Injectable()
export class ParseBooleanPipeStep implements PipeStep<string, boolean> {
    execute(value: any, executionContext: PipeStepExecutionContext): any {
        if (typeof value === 'boolean') {
            return value;
        }

        if (typeof value === 'string') {
            switch (value.toLowerCase()) {
                case 'true':
                case '1':
                case 'yes':
                case 'on':
                    return true;

                case 'false':
                case '0':
                case 'no':
                case 'off':
                    return false;
            }
        }

        throw new PipeStepParsingError(executionContext, `Value '${value}' is not a valid boolean.`, 'boolean');
    }
}

export const ParseBoolean = () => ParseBooleanPipeStep;
