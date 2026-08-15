import { ParseFloat, ParseFloatPipeStep } from './parse-float';
import { PipeStepParsingError } from '../../pipe';

describe('ParseFloatPipeStep', () => {
    const step = new ParseFloatPipeStep();

    it('should return the class when called as a function', () => {
        expect(ParseFloat()).toBe(ParseFloatPipeStep);
    });

    it.each([
        [{ value: '1' }, 1],
        [{ value: '10.5' }, 10.5],
        [{ value: '-3.14' }, -3.14],
        [{ value: 5.2 }, 5.2]
    ])('should parse %p', (value, expected) => {
        expect(step.execute(value as any)).toBe(expected);
    });

    it.each([[{ value: 'abc' }], [{ value: '' }], [{ value: undefined }], [{ value: null }], [{ value: {} }], [{ value: [] }]])(
        'should throw for %p',
        (value) => {
            expect(() => step.execute(value as any)).toThrow(PipeStepParsingError);
        }
    );
});
