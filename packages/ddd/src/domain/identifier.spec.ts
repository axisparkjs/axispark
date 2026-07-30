import { Identifier } from './identifier';

class TestIdentifier extends Identifier<string> {
    protected validate(value: string): void {
        if (!value) {
            throw new Error('Identifier is required');
        }
    }
}

describe('Identifier', () => {
    it('should return the string representation of its value', () => {
        const id = new TestIdentifier('abc-123');

        expect(id.toString()).toBe('abc-123');
    });

    it('should inherit equality from ValueObject', () => {
        const id1 = new TestIdentifier('123');
        const id2 = new TestIdentifier('123');
        const id3 = new TestIdentifier('456');

        expect(id1.equals(id2)).toBe(true);
        expect(id1.equals(id3)).toBe(false);
    });

    it('should validate the value', () => {
        expect(() => new TestIdentifier('')).toThrow('Identifier is required');
    });

    it('should convert non-string values to string', () => {
        class NumberIdentifier extends Identifier<number> {
            protected validate(): void {}
        }

        const id = new NumberIdentifier(123);

        expect(id.toString()).toBe('123');
    });
});
