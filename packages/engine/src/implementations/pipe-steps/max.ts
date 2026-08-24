import { PipeStep, PipeStepValidationError, PipeStepConfig } from '../../pipe';
import { Injectable } from '@axisparkjs/di';
import { ParameterDefinition } from '../../parameter';

export interface MaxPipeStepConfig extends PipeStepConfig {
    value: number;
}

@Injectable()
export class MaxPipeStep implements PipeStep<number, number> {
    execute(parameter: ParameterDefinition, config: MaxPipeStepConfig): any {
        const value = parameter.value;
        if (value > config.value) {
            throw new PipeStepValidationError(parameter, `Value must be less than or equal to ${config.value}.`);
        }

        return value;
    }
}

/**
 * A decorator for applying the `MaxPipeStep` to a method parameter. It uses the `Pipe` decorator to define a pipe step that validates the parameter value against the specified maximum. If the value exceeds the defined maximum, a `PipeStepValidationError` is thrown. This allows the decorated method parameter to enforce numeric constraints, ensuring that it does not exceed the specified limit.
 * @param value The maximum value allowed for the parameter.
 * @returns A pipe decorator that applies the `MaxPipeStep` with the specified maximum value.
 */
export const Max = (value: number) => {
    return {
        pipeStep: MaxPipeStep,
        PipeStepConfig: { value } as MaxPipeStepConfig
    };
};
