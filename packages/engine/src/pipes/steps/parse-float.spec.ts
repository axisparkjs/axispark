import { ParseFloat, ParseFloatPipeStep } from './parse-float';
import { PipeStepParsingError } from '../pipe-step-errors';

describe('ParseFloatPipeStep', () => {
    const step = new ParseFloatPipeStep();
    const data: any = {};

    it('should return the class when called as a function', () => {
        expect(ParseFloat()).toBe(ParseFloatPipeStep);
    });

    it.each([
        ['1', 1],
        ['10.5', 10.5],
        ['-3.14', -3.14],
        [5.2, 5.2]
    ])('should parse %p', (value, expected) => {
        expect(step.execute(value, data)).toBe(expected);
    });

    it.each([['abc'], [''], [undefined], [null], [{}], [[]]])('should throw for %p', (value) => {
        expect(() => step.execute(value, data)).toThrow(PipeStepParsingError);
    });
});
