import { LowerCase, LowerCasePipeStep } from './lower-case';

describe('LowerCase', () => {
    const step = new LowerCasePipeStep();

    it('should return the class when called as a function', () => {
        expect(LowerCase()).toBe(LowerCasePipeStep);
    });

    it('should convert a string to lower case', () => {
        expect(step.execute('HELLO')).toBe('hello');
    });

    it('should preserve an already lower case string', () => {
        expect(step.execute('hello')).toBe('hello');
    });

    it('should convert mixed case strings', () => {
        expect(step.execute('HeLLo WoRLD')).toBe('hello world');
    });

    it('should return an empty string unchanged', () => {
        expect(step.execute('')).toBe('');
    });

    it('should return non-string values unchanged', () => {
        expect(step.execute(123)).toBe(123);
        expect(step.execute(true)).toBe(true);

        const obj = { foo: 'BAR' };
        expect(step.execute(obj)).toBe(obj);

        expect(step.execute(null)).toBeNull();
        expect(step.execute(undefined)).toBeUndefined();
    });
});
