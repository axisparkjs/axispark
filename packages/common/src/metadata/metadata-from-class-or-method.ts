import { MetadataFromClass } from './metadata-from-class';
import { MetadataFromMethod } from './metadata-from-method';

export type MetadataFromClassOrMethod = MetadataFromClass & Partial<MetadataFromMethod>;
