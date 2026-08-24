import { PipeStep, PipeStepParsingError } from '../../pipe';
import { Injectable } from '@axisparkjs/di';
import { ParameterDefinition } from '../../parameter';

@Injectable()
export class ParseFloatPipeStep implements PipeStep<string, number> {
    execute(parameter: ParameterDefinition): any {
        const value = parameter.value;
        const res = Number.parseFloat(value);

        if (Number.isNaN(res)) {
            throw new PipeStepParsingError(parameter, `Value '${value}' is not a valid number.`, 'float');
        }

        return res;
    }
}

/**
 * A decorator for applying the `ParseFloatPipeStep` to a method parameter. It uses the `Pipe` decorator to define a pipe step that attempts to parse the parameter value as a float. If the value cannot be parsed as a float, a `PipeStepParsingError` is thrown. This allows the decorated method parameter to enforce float constraints, ensuring that it is a valid float value.
 * @returns A pipe decorator that applies the `ParseFloatPipeStep`.
 */
export const ParseFloat = () => ParseFloatPipeStep;
