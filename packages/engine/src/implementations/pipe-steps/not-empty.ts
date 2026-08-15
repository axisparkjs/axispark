import { PipeStep, PipeStepValidationError } from '../../pipe';
import { Injectable } from '@axisparkjs/di';
import { ParameterDefinition } from '../../parameter';

@Injectable()
export class NotEmptyPipeStep implements PipeStep<string, string> {
    execute(parameter: ParameterDefinition): any {
        const value = parameter.value;
        if (value === undefined || value === null || value === '') {
            throw new PipeStepValidationError(parameter, `Value must not be empty.`);
        }

        return value;
    }
}

export const NotEmpty = () => NotEmptyPipeStep;
