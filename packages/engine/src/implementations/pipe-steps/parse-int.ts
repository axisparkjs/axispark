import { PipeStep, PipeStepConfig, PipeStepParsingError } from '../../pipe';
import { Injectable } from '@axisparkjs/di';
import { ParameterDefinition } from '../../parameter';

export interface ParseIntPipeStepConfig extends PipeStepConfig {
    radix?: number;
}

@Injectable()
export class ParseIntPipeStep implements PipeStep<string, number> {
    execute(parameter: ParameterDefinition, config?: ParseIntPipeStepConfig): any {
        const value = parameter.value;
        const radix = config?.radix ?? 10;
        const res = Number.parseInt(value, radix);
        if (Number.isNaN(res)) {
            throw new PipeStepParsingError(parameter, `Value '${value}' is not a valid integer.`, 'integer');
        }
        return res;
    }
}

export const ParseInt = (radix?: number) => {
    return {
        pipeStep: ParseIntPipeStep,
        PipeStepConfig: { radix } as ParseIntPipeStepConfig
    };
};
