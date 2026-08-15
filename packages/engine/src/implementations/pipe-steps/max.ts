import { PipeStep, PipeStepValidationError, PipeStepConfig } from '../../pipe';
import { Injectable } from '@axisparkjs/di';
import { ParameterDefinition } from '../../parameter';

export interface MaxPipeStepConfig extends PipeStepConfig {
    value: number;
}

@Injectable()
export class MaxPipeStep implements PipeStep<number, number> {
    execute(parameter: ParameterDefinition, config: MaxPipeStepConfig): any {
        const value = parameter.value;
        if (value > config.value) {
            throw new PipeStepValidationError(parameter, `Value must be less than or equal to ${config.value}.`);
        }

        return value;
    }
}

export const Max = (value: number) => {
    return {
        pipeStep: MaxPipeStep,
        PipeStepConfig: { value } as MaxPipeStepConfig
    };
};
