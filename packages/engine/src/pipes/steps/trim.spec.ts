import { Trim, TrimPipeStep } from './trim';

describe('TrimPipeStep', () => {
    const step = new TrimPipeStep();

    it('should return the class when called as a function', () => {
        expect(Trim()).toBe(TrimPipeStep);
    });

    it('should trim spaces', () => {
        expect(step.execute('  hello  ')).toBe('hello');
    });

    it('should preserve an already trimmed string', () => {
        expect(step.execute('hello')).toBe('hello');
    });

    it('should return an empty string unchanged', () => {
        expect(step.execute('')).toBe('');
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
