import { MetadataFromClass } from './metadata-from-class';

/**
 * An interface representing metadata that comes from a method.
 */
export interface MetadataFromMethod extends MetadataFromClass {
    propertyKey: string | symbol;
}
