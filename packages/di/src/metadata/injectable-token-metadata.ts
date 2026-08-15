import { MetadataFromClass } from '@axisparkjs/common';
import { InjectionToken } from '../token';

export interface InjectableTokenMetadata extends MetadataFromClass {
    injectionToken: InjectionToken;
}
