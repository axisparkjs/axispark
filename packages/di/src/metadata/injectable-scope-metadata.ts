import { MetadataFromClass } from '@axisparkjs/common';
import { InjectableScopes } from '../types';

export interface InjectableScopeMetadata extends MetadataFromClass {
    scope: InjectableScopes;
}
