import { ParseInt, ParseIntPipeStep } from './parse-int';
import { PipeStepParsingError } from '../pipe-step-errors';

describe('ParseIntPipeStep', () => {
    const step = new ParseIntPipeStep();
    const data: any = {};

    it('should return the class when called as a function', () => {
        expect(ParseInt()).toStrictEqual({ pipeStep: ParseIntPipeStep, pipeStepParameters: { radix: undefined } });
    });

    it.each([
        ['1', 1],
        ['10', 10],
        ['-5', -5],
        [20, 20]
    ])('should parse %p', (value, expected) => {
        expect(step.execute(value, data)).toBe(expected);
    });

    it('should support radix', () => {
        expect(step.execute('FF', data, { radix: 16 })).toBe(255);
    });

    it.each([['abc'], [''], [undefined], [null], [{}], [[]]])('should throw for %p', (value) => {
        expect(() => step.execute(value, data)).toThrow(PipeStepParsingError);
    });
});
