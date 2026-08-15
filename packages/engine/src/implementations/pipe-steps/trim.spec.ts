import { Trim, TrimPipeStep } from './trim';

describe('TrimPipeStep', () => {
    const step = new TrimPipeStep();

    it('should return the class when called as a function', () => {
        expect(Trim()).toBe(TrimPipeStep);
    });

    it('should trim spaces', () => {
        expect(step.execute({ value: '  hello  ' } as any)).toBe('hello');
    });

    it('should preserve an already trimmed string', () => {
        expect(step.execute({ value: 'hello' } as any)).toBe('hello');
    });

    it('should return an empty string unchanged', () => {
        expect(step.execute({ value: '' } as any)).toBe('');
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
