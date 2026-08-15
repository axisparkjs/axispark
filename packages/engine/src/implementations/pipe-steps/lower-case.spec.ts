import { LowerCase, LowerCasePipeStep } from './lower-case';

describe('LowerCase', () => {
    const step = new LowerCasePipeStep();

    it('should return the class when called as a function', () => {
        expect(LowerCase()).toBe(LowerCasePipeStep);
    });

    it('should convert a string to lower case', () => {
        expect(step.execute({ value: 'HELLO' } as any)).toBe('hello');
    });

    it('should preserve an already lower case string', () => {
        expect(step.execute({ value: 'hello' } as any)).toBe('hello');
    });

    it('should convert mixed case strings', () => {
        expect(step.execute({ value: 'HeLLo WoRLD' } as any)).toBe('hello world');
    });

    it('should return an empty string unchanged', () => {
        expect(step.execute({ value: '' } as any)).toBe('');
    });

    it('should return non-string values unchanged', () => {
        expect(step.execute({ value: 123 } as any)).toBe(123);
        expect(step.execute({ value: true } as any)).toBe(true);

        const obj = { foo: 'BAR' };
        expect(step.execute({ value: obj } as any)).toBe(obj);

        expect(step.execute({ value: null } as any)).toBeNull();
        expect(step.execute({ value: undefined } as any)).toBeUndefined();
    });
});
