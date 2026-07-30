import { PipeStep } from '../pipe-step';
import { Injectable } from '@axisparkjs/di';

@Injectable()
export class LowerCasePipeStep implements PipeStep<string, string> {
    execute(value: any): any {
        return typeof value === 'string' ? value.toLowerCase() : value;
    }
}

export const LowerCase = () => LowerCasePipeStep;
