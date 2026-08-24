import { MetadataFromMethod } from './metadata-from-method';

/**
 * An interface representing metadata that comes from a parameter.
 */
export interface MetadataFromParameter extends MetadataFromMethod {
    parameterIndex: number;
}
