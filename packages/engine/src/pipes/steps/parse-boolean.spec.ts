import { ParseBoolean, ParseBooleanPipeStep } from './parse-boolean';
import { PipeStepParsingError } from '../pipe-step-errors';

describe('ParseBooleanPipeStep', () => {
    const step = new ParseBooleanPipeStep();
    const data: any = {};

    it('should return the class when called as a function', () => {
        expect(ParseBoolean()).toBe(ParseBooleanPipeStep);
    });

    it.each([
        ['true', true],
        ['TRUE', true],
        ['1', true],
        ['yes', true],
        ['on', true],
        [true, true]
    ])('should parse %p as true', (value, expected) => {
        expect(step.execute(value, data)).toBe(expected);
    });

    it.each([
        ['false', false],
        ['FALSE', false],
        ['0', false],
        ['no', false],
        ['off', false],
        [false, false]
    ])('should parse %p as false', (value, expected) => {
        expect(step.execute(value, data)).toBe(expected);
    });

    it.each([['abc'], ['2'], [''], [1], [0], [{}], [[]], [null], [undefined]])('should throw for %p', (value) => {
        expect(() => step.execute(value, data)).toThrow(PipeStepParsingError);
    });
});
