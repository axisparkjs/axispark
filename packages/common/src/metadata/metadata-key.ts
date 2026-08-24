/**
 * A class representing a metadata key, which can be either a string or a symbol.
 */
export class MetadataKey {
    constructor(public readonly value: string | symbol) {}
}
