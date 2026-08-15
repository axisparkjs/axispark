import { UpperCase, UpperCasePipeStep } from './upper-case';

describe('UpperCasePipeStep', () => {
    const step = new UpperCasePipeStep();

    it('should return the class when called as a function', () => {
        expect(UpperCase()).toBe(UpperCasePipeStep);
    });

    it('should convert a string to upper case', () => {
        expect(step.execute({ value: 'hello' } as any)).toBe('HELLO');
    });

    it('should preserve an already upper case string', () => {
        expect(step.execute({ value: 'HELLO' } as any)).toBe('HELLO');
    });

    it('should convert mixed case strings', () => {
        expect(step.execute({ value: 'HeLLo WoRLD' } as any)).toBe('HELLO WORLD');
    });

    it('should return non-string values unchanged', () => {
        expect(step.execute({ value: 1 } as any)).toBe(1);
        expect(step.execute({ value: true } as any)).toBe(true);

        const obj = {};
        expect(step.execute({ value: obj } as any)).toBe(obj);

        expect(step.execute({ value: null } as any)).toBeNull();
        expect(step.execute({ value: undefined } as any)).toBeUndefined();
    });
});
