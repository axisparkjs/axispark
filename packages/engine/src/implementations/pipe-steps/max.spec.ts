import { Max, MaxPipeStep } from './max';
import { PipeStepValidationError } from '../../pipe';

describe('MaxPipeStep', () => {
    const step = new MaxPipeStep();

    it('should return the class when called as a function', () => {
        expect(Max(10)).toStrictEqual({ pipeStep: MaxPipeStep, PipeStepConfig: { value: 10 } });
    });

    it('should accept a value below the maximum', () => {
        expect(step.execute({ value: 5 } as any, { value: 10 })).toBe(5);
    });

    it('should accept the maximum value', () => {
        expect(step.execute({ value: 10 } as any, { value: 10 })).toBe(10);
    });

    it('should throw when the value is greater than the maximum', () => {
        expect(() => step.execute({ value: 11 } as any, { value: 10 })).toThrow(PipeStepValidationError);
    });
});
