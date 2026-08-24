import { PipeStep, PipeStepConfig, PipeStepValidationError } from '../../pipe';
import { Injectable } from '@axisparkjs/di';
import { ParameterDefinition } from '../../parameter';

export interface RangePipeStepConfig extends PipeStepConfig {
    min: number;
    max: number;
}

@Injectable()
export class RangePipeStep implements PipeStep<number, number> {
    execute(parameter: ParameterDefinition, config: RangePipeStepConfig): any {
        const value = parameter.value;
        if (value < config.min || value > config.max) {
            throw new PipeStepValidationError(parameter, `Value must be between ${config.min} and ${config.max}.`);
        }

        return value;
    }
}

/**
 * A decorator for applying the `RangePipeStep` to a method parameter. It uses the `Pipe` decorator to define a pipe step that validates the parameter value against the specified range. If the value is outside the defined range, a `PipeStepValidationError` is thrown. This allows the decorated method parameter to enforce numeric constraints, ensuring that it meets the specified range requirement.
 * @param min The minimum value allowed for the parameter.
 * @param max The maximum value allowed for the parameter.
 * @returns A pipe decorator that applies the `RangePipeStep` with the specified range.
 */
export const Range = (min: number, max: number) => {
    return {
        pipeStep: RangePipeStep,
        PipeStepConfig: { min, max } as RangePipeStepConfig
    };
};
