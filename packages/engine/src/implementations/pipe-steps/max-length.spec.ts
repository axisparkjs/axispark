import { MaxLength, MaxLengthPipeStep } from './max-length';
import { PipeStepValidationError } from '../../pipe';

describe('MaxLengthPipeStep', () => {
    const step = new MaxLengthPipeStep();

    it('should return the class when called as a function', () => {
        expect(MaxLength(2)).toStrictEqual({ pipeStep: MaxLengthPipeStep, PipeStepConfig: { value: 2 } });
    });

    it('should accept a string shorter than the maximum length', () => {
        expect(step.execute({ value: 'abc' } as any, { value: 5 })).toBe('abc');
    });

    it('should accept a string with the maximum length', () => {
        expect(step.execute({ value: 'abcde' } as any, { value: 5 })).toBe('abcde');
    });

    it('should throw when the string exceeds the maximum length', () => {
        expect(() => step.execute({ value: 'abcdef' } as any, { value: 5 })).toThrow(PipeStepValidationError);
    });
});
