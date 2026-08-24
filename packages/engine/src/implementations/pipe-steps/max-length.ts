import { PipeStep, PipeStepConfig, PipeStepValidationError } from '../../pipe';
import { Injectable } from '@axisparkjs/di';
import { ParameterDefinition } from '../../parameter';

export interface MaxLengthPipeStepConfig extends PipeStepConfig {
    value: number;
}

@Injectable()
export class MaxLengthPipeStep implements PipeStep<string, string> {
    execute(parameter: ParameterDefinition, config: MaxLengthPipeStepConfig): any {
        const value = parameter.value;
        if (value.length > config.value) {
            throw new PipeStepValidationError(parameter, `Length must not exceed ${config.value}.`);
        }

        return value;
    }
}

/**
 * A decorator for applying the `MaxLengthPipeStep` to a method parameter. It uses the `Pipe` decorator to define a pipe step that validates the length of the parameter value against the specified maximum length. If the length exceeds the defined maximum, a `PipeStepValidationError` is thrown. This allows the decorated method parameter to enforce length constraints on string values, ensuring that they do not exceed the specified limit.
 * @param value The maximum length allowed for the parameter value.
 * @returns A pipe decorator that applies the `MaxLengthPipeStep` with the specified maximum length.
 */
export const MaxLength = (value: number) => {
    return {
        pipeStep: MaxLengthPipeStep,
        PipeStepConfig: { value } as MaxLengthPipeStepConfig
    };
};
