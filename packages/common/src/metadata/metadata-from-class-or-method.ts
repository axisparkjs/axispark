import { MetadataFromClass } from './metadata-from-class';
import { MetadataFromMethod } from './metadata-from-method';

/**
 * A type representing metadata that can come from a class or method.
 */
export type MetadataFromClassOrMethod = MetadataFromClass & Partial<MetadataFromMethod>;
