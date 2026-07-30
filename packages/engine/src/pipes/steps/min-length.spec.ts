import { MinLength, MinLengthPipeStep } from './min-length';
import { PipeStepValidationError } from '../pipe-step-errors';

describe('MinLengthPipeStep', () => {
    const step = new MinLengthPipeStep();
    const data: any = {};

    it('should return the class when called as a function', () => {
        expect(MinLength(5)).toStrictEqual({ pipeStep: MinLengthPipeStep, pipeStepParameters: { value: 5 } });
    });

    it('should accept a string longer than the minimum length', () => {
        expect(step.execute('abcdef', data, { value: 5 })).toBe('abcdef');
    });

    it('should accept a string with the minimum length', () => {
        expect(step.execute('abcde', data, { value: 5 })).toBe('abcde');
    });

    it('should throw when the string is shorter than the minimum length', () => {
        expect(() => step.execute('abc', data, { value: 5 })).toThrow(PipeStepValidationError);
    });
});
