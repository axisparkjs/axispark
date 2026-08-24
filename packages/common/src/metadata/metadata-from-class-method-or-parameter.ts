import { MetadataFromClass } from './metadata-from-class';
import { MetadataFromMethod } from './metadata-from-method';
import { MetadataFromParameter } from './metadata-from-parameter';

/**
 * A type representing metadata that can come from a class, method, or parameter.
 */
export type MetadataFromClassMethodOrParameter = MetadataFromClass & Partial<MetadataFromMethod> & Partial<MetadataFromParameter>;
