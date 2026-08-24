import { PipeStep } from '../../pipe';
import { Injectable } from '@axisparkjs/di';
import { ParameterDefinition } from '../../parameter';

@Injectable()
export class UpperCasePipeStep implements PipeStep<string, string> {
    execute(parameter: ParameterDefinition): any {
        const value = parameter.value;
        return typeof value === 'string' ? value.toUpperCase() : value;
    }
}

/**
 * A decorator for applying the `UpperCasePipeStep` to a method parameter. It uses the `Pipe` decorator to define a pipe step that converts the parameter value to uppercase. This allows the decorated method parameter to enforce string case constraints, ensuring that it is an uppercase string value.
 * @returns A pipe decorator that applies the `UpperCasePipeStep`.
 */
export const UpperCase = () => UpperCasePipeStep;
