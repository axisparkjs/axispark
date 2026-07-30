import { ValueObject } from './value-object';

class TestValueObject extends ValueObject<string> {
    protected validate(value: string): void {
        if (!value) {
            throw new Error('Value is required');
        }
    }

    toString(): string {
        return this.value;
    }
}

describe('ValueObject', () => {
    it('should expose its value', () => {
        const vo = new TestValueObject('test');

        expect(vo.value).toBe('test');
    });

    it('should call validate on construction', () => {
        expect(() => new TestValueObject('')).toThrow('Value is required');
    });

    it('should return false when compared with null', () => {
        const vo = new TestValueObject('test');

        expect(vo.equals(null as never)).toBe(false);
    });

    it('should return false when compared with undefined', () => {
        const vo = new TestValueObject('test');

        expect(vo.equals(undefined as never)).toBe(false);
    });

    it('should return true when compared with itself', () => {
        const vo = new TestValueObject('test');

        expect(vo.equals(vo)).toBe(true);
    });

    it('should return true when two value objects have the same value', () => {
        const vo1 = new TestValueObject('test');
        const vo2 = new TestValueObject('test');

        expect(vo1.equals(vo2)).toBe(true);
    });

    it('should return false when two value objects have different values', () => {
        const vo1 = new TestValueObject('test');
        const vo2 = new TestValueObject('other');

        expect(vo1.equals(vo2)).toBe(false);
    });

    it('should compare complex values', () => {
        class ObjectValueObject extends ValueObject<{ id: number; name: string }> {
            protected validate(): void {}

            toString(): string {
                return JSON.stringify(this.value);
            }
        }

        const vo1 = new ObjectValueObject({ id: 1, name: 'John' });
        const vo2 = new ObjectValueObject({ id: 1, name: 'John' });
        const vo3 = new ObjectValueObject({ id: 2, name: 'Jane' });

        expect(vo1.equals(vo2)).toBe(true);
        expect(vo1.equals(vo3)).toBe(false);
    });
});
