import { Range, RangePipeStep } from './range';
import { PipeStepValidationError } from '../../pipe';

describe('RangePipeStep', () => {
    const step = new RangePipeStep();

    it('should return the class when called as a function', () => {
        expect(Range(1, 10)).toStrictEqual({ pipeStep: RangePipeStep, PipeStepConfig: { min: 1, max: 10 } });
    });

    it.each([[5], [10], [7]])('should accept %p', (value) => {
        expect(
            step.execute({ value } as any, {
                min: 5,
                max: 10
            })
        ).toBe(value);
    });

    it.each([[4], [11]])('should throw for %p', (value) => {
        expect(() =>
            step.execute({ value } as any, {
                min: 5,
                max: 10
            })
        ).toThrow(PipeStepValidationError);
    });
});
