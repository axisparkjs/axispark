import { ParseInt, ParseIntPipeStep } from './parse-int';
import { PipeStepParsingError } from '../../pipe';

describe('ParseIntPipeStep', () => {
    const step = new ParseIntPipeStep();

    it('should return the class when called as a function', () => {
        expect(ParseInt()).toStrictEqual({ pipeStep: ParseIntPipeStep, PipeStepConfig: { radix: undefined } });
    });

    it.each([
        [{ value: '1' }, 1],
        [{ value: '10' }, 10],
        [{ value: '-5' }, -5],
        [{ value: 20 }, 20]
    ])('should parse %p', (value, expected) => {
        expect(step.execute(value as any)).toBe(expected);
    });

    it('should support radix', () => {
        expect(step.execute({ value: 'FF' } as any, { radix: 16 })).toBe(255);
    });

    it.each([[{ value: 'abc' }], [{ value: '' }], [{ value: undefined }], [{ value: null }], [{ value: {} }], [{ value: [] }]])(
        'should throw for %p',
        (value) => {
            expect(() => step.execute(value as any)).toThrow(PipeStepParsingError);
        }
    );
});
