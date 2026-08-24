import { ValueObject } from './value-object';

/**
 * Identifier is an abstract class that represents a unique identifier for entities in a domain-driven design context. It extends the ValueObject class and provides a base for creating specific identifier types that can be used to uniquely identify entities within the domain. Subclasses of Identifier can be created to represent different types of identifiers, allowing for strong typing and encapsulation of identifier logic.
 */
export abstract class Identifier<T = string> extends ValueObject<T> {
    /**
     * Converts the identifier to a string representation.
     * @returns The string representation of the identifier.
     */
    toString(): string {
        return String(this._value);
    }
}
