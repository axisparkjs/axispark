import { PipeStep, PipeStepConfig, PipeStepValidationError } from '../../pipe';
import { Injectable } from '@axisparkjs/di';
import { ParameterDefinition } from '../../parameter';

export interface RegexPipeStepConfig extends PipeStepConfig {
    pattern: RegExp;
}

@Injectable()
export class RegexPipeStep implements PipeStep<string, string> {
    execute(parameter: ParameterDefinition, config: RegexPipeStepConfig): any {
        const value = parameter.value;
        if (!config.pattern.test(value)) {
            throw new PipeStepValidationError(parameter, `Value does not match the expected format (${config.pattern.toString()}).`);
        }

        return value;
    }
}

/**
 * A decorator for applying the `RegexPipeStep` to a method parameter. It uses the `Pipe` decorator to define a pipe step that validates the parameter value against the specified regular expression. If the value does not match the pattern, a `PipeStepValidationError` is thrown. This allows the decorated method parameter to enforce string format constraints, ensuring that it matches the expected pattern.
 * @param pattern The regular expression to use for validation.
 * @returns A pipe decorator that applies the `RegexPipeStep` with the specified pattern.
 */
export const Regex = (pattern: RegExp) => {
    return {
        pipeStep: RegexPipeStep,
        PipeStepConfig: { pattern } as RegexPipeStepConfig
    };
};
