import { PipeStep } from '../../pipe';
import { Injectable } from '@axisparkjs/di';
import { ParameterDefinition } from '../../parameter';

@Injectable()
export class TrimPipeStep implements PipeStep<string, string> {
    execute(parameter: ParameterDefinition): any {
        const value = parameter.value;
        return typeof value === 'string' ? value.trim() : value;
    }
}

/**
 * A decorator for applying the `TrimPipeStep` to a method parameter. It uses the `Pipe` decorator to define a pipe step that trims whitespace from the parameter value. This allows the decorated method parameter to enforce string formatting constraints, ensuring that it is a trimmed string value.
 * @returns A pipe decorator that applies the `TrimPipeStep`.
 */
export const Trim = () => TrimPipeStep;
