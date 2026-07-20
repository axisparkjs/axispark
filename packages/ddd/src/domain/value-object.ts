export abstract class ValueObject<T> {
    protected readonly _value: T;

    constructor(value: T) {
        this.validate(value);
        this._value = value;
    }

    get value(): Readonly<T> {
        return this._value;
    }

    public equals(vo: ValueObject<T>): boolean {
        if (vo === null || vo === undefined)
            return false;
        if (this === vo)
            return true;
        return JSON.stringify(this._value) === JSON.stringify(vo.value);
    }

    protected abstract validate(value: T): void;

    public abstract toString(): string;
}