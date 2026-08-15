import { PipeStep } from '../../pipe';
import { ParameterDefinition } from '../../parameter';
import { Injectable } from '@axisparkjs/di';

@Injectable()
export class LowerCasePipeStep implements PipeStep<string, string> {
    execute(parameter: ParameterDefinition): any {
        const value = parameter.value;
        return typeof value === 'string' ? value.toLowerCase() : value;
    }
}

export const LowerCase = () => LowerCasePipeStep;
