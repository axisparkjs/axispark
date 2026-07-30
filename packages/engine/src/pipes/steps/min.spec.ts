import { Min, MinPipeStep } from './min';
import { PipeStepValidationError } from '../pipe-step-errors';

describe('MinPipeStep', () => {
    const step = new MinPipeStep();
    const data: any = {};

    it('should return the class when called as a function', () => {
        expect(Min(5)).toStrictEqual({ pipeStep: MinPipeStep, pipeStepParameters: { value: 5 } });
    });

    it('should accept a value greater than the minimum', () => {
        expect(step.execute(10, data, { value: 5 })).toBe(10);
    });

    it('should accept the minimum value', () => {
        expect(step.execute(5, data, { value: 5 })).toBe(5);
    });

    it('should throw when the value is lower than the minimum', () => {
        expect(() => step.execute(4, data, { value: 5 })).toThrow(PipeStepValidationError);
    });
});
