import { PipeStep, PipeStepConfig, PipeStepParsingError } from '../../pipe';
import { Injectable } from '@axisparkjs/di';
import { ParameterDefinition } from '../../parameter';

export interface ParseIntPipeStepConfig extends PipeStepConfig {
    radix?: number;
}

@Injectable()
export class ParseIntPipeStep implements PipeStep<string, number> {
    execute(parameter: ParameterDefinition, config?: ParseIntPipeStepConfig): any {
        const value = parameter.value;
        const radix = config?.radix ?? 10;
        const res = Number.parseInt(value, radix);
        if (Number.isNaN(res)) {
            throw new PipeStepParsingError(parameter, `Value '${value}' is not a valid integer.`, 'integer');
        }
        return res;
    }
}

/**
 * A decorator for applying the `ParseIntPipeStep` to a method parameter. It uses the `Pipe` decorator to define a pipe step that attempts to parse the parameter value as an integer. If the value cannot be parsed as an integer, a `PipeStepParsingError` is thrown. This allows the decorated method parameter to enforce integer constraints, ensuring that it is a valid integer value.
 * @param radix The base of the number system to use for parsing (default is 10).
 * @returns A pipe decorator that applies the `ParseIntPipeStep`.
 */
export const ParseInt = (radix?: number) => {
    return {
        pipeStep: ParseIntPipeStep,
        PipeStepConfig: { radix } as ParseIntPipeStepConfig
    };
};
