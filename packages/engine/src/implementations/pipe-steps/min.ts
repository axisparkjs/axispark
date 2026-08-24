import { PipeStep, PipeStepConfig, PipeStepValidationError } from '../../pipe';
import { Injectable } from '@axisparkjs/di';
import { ParameterDefinition } from '../../parameter';

export interface MinPipeStepConfig extends PipeStepConfig {
    value: number;
}

@Injectable()
export class MinPipeStep implements PipeStep<number, number> {
    execute(parameter: ParameterDefinition, config: MinPipeStepConfig): any {
        const value = parameter.value;
        if (value < config.value) {
            throw new PipeStepValidationError(parameter, `Value must be greater than or equal to ${config.value}.`);
        }

        return value;
    }
}

/**
 * A decorator for applying the `MinPipeStep` to a method parameter. It uses the `Pipe` decorator to define a pipe step that validates the parameter value against the specified minimum. If the value is less than the defined minimum, a `PipeStepValidationError` is thrown. This allows the decorated method parameter to enforce numeric constraints, ensuring that it meets the specified minimum requirement.
 * @param value The minimum value allowed for the parameter.
 * @returns A pipe decorator that applies the `MinPipeStep` with the specified minimum value.
 */
export const Min = (value: number) => {
    return {
        pipeStep: MinPipeStep,
        PipeStepConfig: { value } as MinPipeStepConfig
    };
};
