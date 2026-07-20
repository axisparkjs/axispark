import { Identifier } from "./identity";

export abstract class Entity<T extends Identifier> {
    protected readonly _id: T;

    constructor(id: T) {
        this._id = id;
    }

    get id(): Readonly<T> {
        return this._id;
    }

    public equals(other: Entity<T>): boolean {
        if (other === null || other === undefined)
            return false;
        if (this === other)
            return true;
        
        return this.constructor === other.constructor && this._id.equals(other._id);
    }
}