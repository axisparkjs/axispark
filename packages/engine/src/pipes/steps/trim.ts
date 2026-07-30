import { PipeStep } from '../pipe-step';
import { Injectable } from '@axisparkjs/di';

@Injectable()
export class TrimPipeStep implements PipeStep<string, string> {
    execute(value: any): any {
        return typeof value === 'string' ? value.trim() : value;
    }
}

export const Trim = () => TrimPipeStep;
