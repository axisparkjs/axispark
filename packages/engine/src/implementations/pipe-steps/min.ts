import { PipeStep, PipeStepConfig, PipeStepValidationError } from '../../pipe';
import { Injectable } from '@axisparkjs/di';
import { ParameterDefinition } from '../../parameter';

export interface MinPipeStepConfig extends PipeStepConfig {
    value: number;
}

@Injectable()
export class MinPipeStep implements PipeStep<number, number> {
    execute(parameter: ParameterDefinition, config: MinPipeStepConfig): any {
        const value = parameter.value;
        if (value < config.value) {
            throw new PipeStepValidationError(parameter, `Value must be greater than or equal to ${config.value}.`);
        }

        return value;
    }
}

export const Min = (value: number) => {
    return {
        pipeStep: MinPipeStep,
        PipeStepConfig: { value } as MinPipeStepConfig
    };
};
