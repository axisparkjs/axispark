/**
 * ValueObject is an abstract class that represents a value object in a domain-driven design context. It provides a base for creating value objects that encapsulate a specific value and provide equality comparison based on that value. Subclasses of ValueObject can be created to represent specific types of values, allowing for strong typing and encapsulation of value logic.
 */
export abstract class ValueObject<T> {
    protected readonly _value: T;

    /**
     * Initializes a new instance of the ValueObject class.
     * @param value The value for the value object.
     */
    constructor(value: T) {
        this.validate(value);
        this._value = value;
    }

    /**
     * Gets the value for the value object.
     * @returns The value for the value object.
     */
    get value(): Readonly<T> {
        return this._value;
    }

    /**
     * Determines whether the current value object is equal to another value object of the same type.
     * @param vo The other value object to compare with.
     * @returns True if the value objects are equal; otherwise, false.
     */
    public equals(vo: ValueObject<T>): boolean {
        if (vo === null || vo === undefined) return false;
        if (this === vo) return true;
        return JSON.stringify(this._value) === JSON.stringify(vo.value);
    }

    /**
     * Validates the value for the value object.
     * @param value The value to validate.
     */
    protected abstract validate(value: T): void;

    /**
     * Converts the value object to a string representation.
     * @returns The string representation of the value object.
     */
    public abstract toString(): string;
}
