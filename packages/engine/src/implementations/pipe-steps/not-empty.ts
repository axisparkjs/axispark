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

/**
 * A decorator for applying the `NotEmptyPipeStep` to a method parameter. It uses the `Pipe` decorator to define a pipe step that validates the parameter value against the specified minimum length. If the length is less than the defined minimum, a `PipeStepValidationError` is thrown. This allows the decorated method parameter to enforce length constraints on string values, ensuring that they meet the specified minimum requirement.
 * @returns A pipe decorator that applies the `NotEmptyPipeStep`.
 */
export const NotEmpty = () => NotEmptyPipeStep;
