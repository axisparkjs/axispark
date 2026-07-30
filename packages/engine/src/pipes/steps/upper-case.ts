import { PipeStep } from '../pipe-step';
import { Injectable } from '@axisparkjs/di';

@Injectable()
export class UpperCasePipeStep implements PipeStep<string, string> {
    execute(value: any): any {
        return typeof value === 'string' ? value.toUpperCase() : value;
    }
}

export const UpperCase = () => UpperCasePipeStep;
