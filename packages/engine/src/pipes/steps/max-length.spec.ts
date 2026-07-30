import { MaxLength, MaxLengthPipeStep } from './max-length';
import { PipeStepValidationError } from '../pipe-step-errors';

describe('MaxLengthPipeStep', () => {
    const step = new MaxLengthPipeStep();
    const data: any = {};

    it('should return the class when called as a function', () => {
        expect(MaxLength(2)).toStrictEqual({ pipeStep: MaxLengthPipeStep, pipeStepParameters: { value: 2 } });
    });

    it('should accept a string shorter than the maximum length', () => {
        expect(step.execute('abc', data, { value: 5 })).toBe('abc');
    });

    it('should accept a string with the maximum length', () => {
        expect(step.execute('abcde', data, { value: 5 })).toBe('abcde');
    });

    it('should throw when the string exceeds the maximum length', () => {
        expect(() => step.execute('abcdef', data, { value: 5 })).toThrow(PipeStepValidationError);
    });
});
