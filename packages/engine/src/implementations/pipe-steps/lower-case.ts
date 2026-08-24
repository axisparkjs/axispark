import { PipeStep } from '../../pipe';
import { ParameterDefinition } from '../../parameter';
import { Injectable } from '@axisparkjs/di';

@Injectable()
export class LowerCasePipeStep implements PipeStep<string, string> {
    execute(parameter: ParameterDefinition): any {
        const value = parameter.value;
        return typeof value === 'string' ? value.toLowerCase() : value;
    }
}

/**
 * A decorator for applying the `LowerCasePipeStep` to a method parameter. It uses the `Pipe` decorator to define a pipe step that converts the parameter value to lowercase. This allows the decorated method parameter to receive a lowercase version of the input string, enabling consistent formatting and processing of string values.
 * @returns A pipe decorator that applies the `LowerCasePipeStep`.
 */
export const LowerCase = () => LowerCasePipeStep;
