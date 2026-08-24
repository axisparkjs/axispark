import { PipeStep, PipeStepConfig, PipeStepValidationError } from '../../pipe';
import { Injectable } from '@axisparkjs/di';
import { ParameterDefinition } from '../../parameter';

export interface MinLengthPipeStepConfig extends PipeStepConfig {
    value: number;
}

@Injectable()
export class MinLengthPipeStep implements PipeStep<string, string> {
    execute(parameter: ParameterDefinition, config: MinLengthPipeStepConfig): any {
        const value = parameter.value;
        if (value.length < config.value) {
            throw new PipeStepValidationError(parameter, `Length must be at least ${config.value}.`);
        }

        return value;
    }
}

/**
 * A decorator for applying the `MinLengthPipeStep` to a method parameter. It uses the `Pipe` decorator to define a pipe step that validates the length of the parameter value against the specified minimum length. If the length is less than the defined minimum, a `PipeStepValidationError` is thrown. This allows the decorated method parameter to enforce length constraints on string values, ensuring that they meet the specified minimum requirement.
 * @param value The minimum length allowed for the parameter value.
 * @returns A pipe decorator that applies the `MinLengthPipeStep` with the specified minimum length.
 */
export const MinLength = (value: number) => {
    return {
        pipeStep: MinLengthPipeStep,
        PipeStepConfig: { value } as MinLengthPipeStepConfig
    };
};
