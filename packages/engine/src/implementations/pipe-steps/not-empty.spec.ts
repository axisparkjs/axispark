import { NotEmpty, NotEmptyPipeStep } from './not-empty';
import { PipeStepValidationError } from '../../pipe';

describe('NotEmptyPipeStep', () => {
    const step = new NotEmptyPipeStep();

    it('should return the class when called as a function', () => {
        expect(NotEmpty()).toBe(NotEmptyPipeStep);
    });

    it('should accept a non-empty string', () => {
        expect(step.execute({ value: 'hello' } as any)).toBe('hello');
    });

    it('should throw for an empty string', () => {
        expect(() => step.execute({ value: '' } as any)).toThrow(PipeStepValidationError);
    });

    it('should throw for null', () => {
        expect(() => step.execute({ value: null } as any)).toThrow(PipeStepValidationError);
    });

    it('should throw for undefined', () => {
        expect(() => step.execute({ value: undefined } as any)).toThrow(PipeStepValidationError);
    });
});
