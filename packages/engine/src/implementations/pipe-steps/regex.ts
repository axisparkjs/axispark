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

export const Regex = (pattern: RegExp) => {
    return {
        pipeStep: RegexPipeStep,
        PipeStepConfig: { pattern } as RegexPipeStepConfig
    };
};
