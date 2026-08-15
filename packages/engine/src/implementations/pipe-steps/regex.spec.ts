import { Regex, RegexPipeStep } from './regex';
import { PipeStepValidationError } from '../../pipe';

describe('RegexPipeStep', () => {
    const step = new RegexPipeStep();
    const pattern = /^[a-z]+$/;

    it('should return the class when called as a function', () => {
        expect(Regex(pattern)).toStrictEqual({ pipeStep: RegexPipeStep, PipeStepConfig: { pattern } });
    });

    it.each([['abc'], ['hello'], ['test']])('should accept %p', (value) => {
        expect(step.execute({ value } as any, { pattern })).toBe(value);
    });

    it.each([['ABC'], ['123'], ['abc123'], ['']])('should throw for %p', (value) => {
        expect(() => step.execute({ value } as any, { pattern })).toThrow(PipeStepValidationError);
    });
});
