import { Identifier } from './identifier';

/**
 * Entity is an abstract class that represents an entity in a domain-driven design context. It provides a base for creating entities that have a unique identifier and can be compared for equality.
 * @template T The type of the unique identifier for the entity, which must extend the Identifier class.
 */
export abstract class Entity<T extends Identifier> {
    protected readonly _id: T;

    /**
     * Initializes a new instance of the Entity class.
     * @param id The unique identifier for the entity.
     */
    constructor(id: T) {
        this._id = id;
    }

    /**
     * Gets the unique identifier for the entity.
     * @returns The unique identifier for the entity.
     */
    get id(): Readonly<T> {
        return this._id;
    }

    /**
     * Determines whether the current entity is equal to another entity of the same type.
     * @param other The other entity to compare with.
     * @returns True if the entities are equal; otherwise, false.
     */
    public equals(other: Entity<T>): boolean {
        if (other === null || other === undefined) return false;
        if (this === other) return true;

        return this.constructor === other.constructor && this._id.equals(other._id);
    }
}
