import { PipeStep, PipeStepConfig, PipeStepValidationError } from '../../pipe';
import { Injectable } from '@axisparkjs/di';
import { ParameterDefinition } from '../../parameter';

export interface MaxLengthPipeStepConfig extends PipeStepConfig {
    value: number;
}

@Injectable()
export class MaxLengthPipeStep implements PipeStep<string, string> {
    execute(parameter: ParameterDefinition, config: MaxLengthPipeStepConfig): any {
        const value = parameter.value;
        if (value.length > config.value) {
            throw new PipeStepValidationError(parameter, `Length must not exceed ${config.value}.`);
        }

        return value;
    }
}

export const MaxLength = (value: number) => {
    return {
        pipeStep: MaxLengthPipeStep,
        PipeStepConfig: { value } as MaxLengthPipeStepConfig
    };
};
