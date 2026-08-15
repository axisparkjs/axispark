import { MetadataFromClass } from './metadata-from-class';

export interface MetadataFromMethod extends MetadataFromClass {
    propertyKey: string | symbol;
}
