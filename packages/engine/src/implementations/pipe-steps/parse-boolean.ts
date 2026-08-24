import { PipeStep, PipeStepParsingError } from '../../pipe';
import { Injectable } from '@axisparkjs/di';
import { ParameterDefinition } from '../../parameter';

@Injectable()
export class ParseBooleanPipeStep implements PipeStep<string, boolean> {
    execute(parameter: ParameterDefinition): any {
        const value = parameter.value;
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

        throw new PipeStepParsingError(parameter, `Value '${value}' is not a valid boolean.`, 'boolean');
    }
}

/**
 * A decorator for applying the `ParseBooleanPipeStep` to a method parameter. It uses the `Pipe` decorator to define a pipe step that attempts to parse the parameter value as a boolean. If the value cannot be parsed as a boolean, a `PipeStepParsingError` is thrown. This allows the decorated method parameter to enforce boolean constraints, ensuring that it is a valid boolean value.
 * @returns A pipe decorator that applies the `ParseBooleanPipeStep`.
 */
export const ParseBoolean = () => ParseBooleanPipeStep;
