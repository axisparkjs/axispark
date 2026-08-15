import { MetadataFromClass } from '@axisparkjs/common';
import { Token } from '../token';

export interface InjectMetadata extends MetadataFromClass {
    params: Map<number, Token>;
}
