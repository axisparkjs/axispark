import { MetadataFromClass } from './metadata-from-class';
import { MetadataFromMethod } from './metadata-from-method';
import { MetadataFromParameter } from './metadata-from-parameter';

export type MetadataFromClassMethodOrParameter = MetadataFromClass & Partial<MetadataFromMethod> & Partial<MetadataFromParameter>;
