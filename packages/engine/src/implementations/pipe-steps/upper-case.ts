import { PipeStep } from '../../pipe';
import { Injectable } from '@axisparkjs/di';
import { ParameterDefinition } from '../../parameter';

@Injectable()
export class UpperCasePipeStep implements PipeStep<string, string> {
    execute(parameter: ParameterDefinition): any {
        const value = parameter.value;
        return typeof value === 'string' ? value.toUpperCase() : value;
    }
}

export const UpperCase = () => UpperCasePipeStep;
