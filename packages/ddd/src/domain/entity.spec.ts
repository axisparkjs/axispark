import { Entity } from './entity';
import { Identifier } from './identifier';

class TestIdentifier extends Identifier {
    validate(): void {}
}

class TestEntity extends Entity<TestIdentifier> {}

class AnotherEntity extends Entity<TestIdentifier> {}

describe('Entity', () => {
    const id1 = new TestIdentifier('1');
    const id2 = new TestIdentifier('2');

    it('should expose its identifier', () => {
        const entity = new TestEntity(id1);

        expect(entity.id).toBe(id1);
    });

    it('should return false when compared with null', () => {
        const entity = new TestEntity(id1);

        expect(entity.equals(null as never)).toBe(false);
    });

    it('should return false when compared with undefined', () => {
        const entity = new TestEntity(id1);

        expect(entity.equals(undefined as never)).toBe(false);
    });

    it('should return true when compared with itself', () => {
        const entity = new TestEntity(id1);

        expect(entity.equals(entity)).toBe(true);
    });

    it('should return true when two entities have the same type and identifier', () => {
        const entity1 = new TestEntity(id1);
        const entity2 = new TestEntity(new TestIdentifier('1'));

        expect(entity1.equals(entity2)).toBe(true);
    });

    it('should return false when two entities have different identifiers', () => {
        const entity1 = new TestEntity(id1);
        const entity2 = new TestEntity(id2);

        expect(entity1.equals(entity2)).toBe(false);
    });

    it('should return false when two entities have the same identifier but different types', () => {
        const entity1 = new TestEntity(id1);
        const entity2 = new AnotherEntity(new TestIdentifier('1'));

        expect(entity1.equals(entity2 as never)).toBe(false);
    });
});
