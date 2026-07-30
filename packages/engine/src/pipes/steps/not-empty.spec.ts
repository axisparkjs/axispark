import { NotEmpty, NotEmptyPipeStep } from './not-empty';
import { PipeStepValidationError } from '../pipe-step-errors';

describe('NotEmptyPipeStep', () => {
    const step = new NotEmptyPipeStep();
    const data: any = {};

    it('should return the class when called as a function', () => {
        expect(NotEmpty()).toBe(NotEmptyPipeStep);
    });

    it('should accept a non-empty string', () => {
        expect(step.execute('hello', data)).toBe('hello');
    });

    it('should throw for an empty string', () => {
        expect(() => step.execute('', data)).toThrow(PipeStepValidationError);
    });

    it('should throw for null', () => {
        expect(() => step.execute(null, data)).toThrow(PipeStepValidationError);
    });

    it('should throw for undefined', () => {
        expect(() => step.execute(undefined, data)).toThrow(PipeStepValidationError);
    });
});
