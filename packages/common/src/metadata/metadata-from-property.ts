import { MetadataFromClass } from './metadata-from-class';

/**
 * An interface representing metadata that comes from a property.
 */
export interface MetadataFromProperty extends MetadataFromClass {
    propertyKey: string | symbol;
}
