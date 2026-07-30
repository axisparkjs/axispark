import { Max, MaxPipeStep } from './max';
import { PipeStepValidationError } from '../pipe-step-errors';

describe('MaxPipeStep', () => {
    const step = new MaxPipeStep();
    const data: any = {};

    it('should return the class when called as a function', () => {
        expect(Max(10)).toStrictEqual({ pipeStep: MaxPipeStep, pipeStepParameters: { value: 10 } });
    });

    it('should accept a value below the maximum', () => {
        expect(step.execute(5, data, { value: 10 })).toBe(5);
    });

    it('should accept the maximum value', () => {
        expect(step.execute(10, data, { value: 10 })).toBe(10);
    });

    it('should throw when the value is greater than the maximum', () => {
        expect(() => step.execute(11, data, { value: 10 })).toThrow(PipeStepValidationError);
    });
});
