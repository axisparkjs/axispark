import { ParseBoolean, ParseBooleanPipeStep } from './parse-boolean';
import { PipeStepParsingError } from '../../pipe';

describe('ParseBooleanPipeStep', () => {
    const step = new ParseBooleanPipeStep();

    it('should return the class when called as a function', () => {
        expect(ParseBoolean()).toBe(ParseBooleanPipeStep);
    });

    it.each([
        [{ value: 'true' }, true],
        [{ value: 'TRUE' }, true],
        [{ value: '1' }, true],
        [{ value: 'yes' }, true],
        [{ value: 'on' }, true],
        [{ value: true }, true]
    ])('should parse %p as true', (value, expected) => {
        expect(step.execute(value as any)).toBe(expected);
    });

    it.each([
        [{ value: 'false' }, false],
        [{ value: 'FALSE' }, false],
        [{ value: '0' }, false],
        [{ value: 'no' }, false],
        [{ value: 'off' }, false],
        [{ value: false }, false]
    ])('should parse %p as false', (value, expected) => {
        expect(step.execute(value as any)).toBe(expected);
    });

    it.each([
        [{ value: 'abc' }],
        [{ value: '2' }],
        [{ value: '' }],
        [{ value: 1 }],
        [{ value: 0 }],
        [{ value: {} }],
        [{ value: [] }],
        [{ value: null }],
        [{ value: undefined }]
    ])('should throw for %p', (value) => {
        expect(() => step.execute(value as any)).toThrow(PipeStepParsingError);
    });
});
