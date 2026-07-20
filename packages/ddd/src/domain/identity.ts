import { ValueObject } from "./value-object";

export abstract class Identifier<T = string> extends ValueObject<T> {
    toString(): string {
        return String(this._value);
    }
}