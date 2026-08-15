import { PipeStep, PipeStepParsingError } from '../../pipe';
import { Injectable } from '@axisparkjs/di';
import { ParameterDefinition } from '../../parameter';

@Injectable()
export class ParseFloatPipeStep implements PipeStep<string, number> {
    execute(parameter: ParameterDefinition): any {
        const value = parameter.value;
        const res = Number.parseFloat(value);

        if (Number.isNaN(res)) {
            throw new PipeStepParsingError(parameter, `Value '${value}' is not a valid number.`, 'float');
        }

        return res;
    }
}

export const ParseFloat = () => ParseFloatPipeStep;
