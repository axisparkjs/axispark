import { ClassType } from '@axisparkjs/common';
import { MetadataFromClassOrMethod } from '@axisparkjs/common';
import { AuthorizationPolicy } from '../types/authorization-policy';

export interface SecuredMetadata extends MetadataFromClassOrMethod {
    policies: ClassType<AuthorizationPolicy>[];
}
