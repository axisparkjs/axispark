import { PipeStep, PipeStepConfig, PipeStepValidationError } from '../../pipe';
import { Injectable } from '@axisparkjs/di';
import { ParameterDefinition } from '../../parameter';

export interface MinLengthPipeStepConfig extends PipeStepConfig {
    value: number;
}

@Injectable()
export class MinLengthPipeStep implements PipeStep<string, string> {
    execute(parameter: ParameterDefinition, config: MinLengthPipeStepConfig): any {
        const value = parameter.value;
        if (value.length < config.value) {
            throw new PipeStepValidationError(parameter, `Length must be at least ${config.value}.`);
        }

        return value;
    }
}

export const MinLength = (value: number) => {
    return {
        pipeStep: MinLengthPipeStep,
        PipeStepConfig: { value } as MinLengthPipeStepConfig
    };
};
