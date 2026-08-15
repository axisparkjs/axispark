import { MetadataFromClass } from './metadata-from-class';

export interface MetadataFromProperty extends MetadataFromClass {
    propertyKey: string | symbol;
}
