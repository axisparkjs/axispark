import { MinLength, MinLengthPipeStep } from './min-length';
import { PipeStepValidationError } from '../../pipe';

describe('MinLengthPipeStep', () => {
    const step = new MinLengthPipeStep();

    it('should return the class when called as a function', () => {
        expect(MinLength(5)).toStrictEqual({ pipeStep: MinLengthPipeStep, PipeStepConfig: { value: 5 } });
    });

    it('should accept a string longer than the minimum length', () => {
        expect(step.execute({ value: 'abcdef' } as any, { value: 5 })).toBe('abcdef');
    });

    it('should accept a string with the minimum length', () => {
        expect(step.execute({ value: 'abcde' } as any, { value: 5 })).toBe('abcde');
    });

    it('should throw when the string is shorter than the minimum length', () => {
        expect(() => step.execute({ value: 'abc' } as any, { value: 5 })).toThrow(PipeStepValidationError);
    });
});
