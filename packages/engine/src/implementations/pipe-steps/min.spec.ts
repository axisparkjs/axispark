import { Min, MinPipeStep } from './min';
import { PipeStepValidationError } from '../../pipe';

describe('MinPipeStep', () => {
    const step = new MinPipeStep();

    it('should return the class when called as a function', () => {
        expect(Min(5)).toStrictEqual({ pipeStep: MinPipeStep, PipeStepConfig: { value: 5 } });
    });

    it('should accept a value greater than the minimum', () => {
        expect(step.execute({ value: 10 } as any, { value: 5 })).toBe(10);
    });

    it('should accept the minimum value', () => {
        expect(step.execute({ value: 5 } as any, { value: 5 })).toBe(5);
    });

    it('should throw when the value is lower than the minimum', () => {
        expect(() => step.execute({ value: 4 } as any, { value: 5 })).toThrow(PipeStepValidationError);
    });
});
