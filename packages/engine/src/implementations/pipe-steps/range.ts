import { PipeStep, PipeStepConfig, PipeStepValidationError } from '../../pipe';
import { Injectable } from '@axisparkjs/di';
import { ParameterDefinition } from '../../parameter';

export interface RangePipeStepConfig extends PipeStepConfig {
    min: number;
    max: number;
}

@Injectable()
export class RangePipeStep implements PipeStep<number, number> {
    execute(parameter: ParameterDefinition, config: RangePipeStepConfig): any {
        const value = parameter.value;
        if (value < config.min || value > config.max) {
            throw new PipeStepValidationError(parameter, `Value must be between ${config.min} and ${config.max}.`);
        }

        return value;
    }
}

export const Range = (min: number, max: number) => {
    return {
        pipeStep: RangePipeStep,
        PipeStepConfig: { min, max } as RangePipeStepConfig
    };
};
