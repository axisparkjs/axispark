import { PipeStep } from '../../pipe';
import { Injectable } from '@axisparkjs/di';
import { ParameterDefinition } from '../../parameter';

@Injectable()
export class TrimPipeStep implements PipeStep<string, string> {
    execute(parameter: ParameterDefinition): any {
        const value = parameter.value;
        return typeof value === 'string' ? value.trim() : value;
    }
}

export const Trim = () => TrimPipeStep;
