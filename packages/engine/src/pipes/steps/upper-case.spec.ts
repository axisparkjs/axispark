import { UpperCase, UpperCasePipeStep } from './upper-case';

describe('UpperCasePipeStep', () => {
    const step = new UpperCasePipeStep();

    it('should return the class when called as a function', () => {
        expect(UpperCase()).toBe(UpperCasePipeStep);
    });

    it('should convert a string to upper case', () => {
        expect(step.execute('hello')).toBe('HELLO');
    });

    it('should preserve an already upper case string', () => {
        expect(step.execute('HELLO')).toBe('HELLO');
    });

    it('should convert mixed case strings', () => {
        expect(step.execute('HeLLo WoRLD')).toBe('HELLO WORLD');
    });

    it('should return non-string values unchanged', () => {
        expect(step.execute(1)).toBe(1);
        expect(step.execute(true)).toBe(true);

        const obj = {};
        expect(step.execute(obj)).toBe(obj);

        expect(step.execute(null)).toBeNull();
        expect(step.execute(undefined)).toBeUndefined();
    });
});
