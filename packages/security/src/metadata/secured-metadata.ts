import { ClassType } from '@axisparkjs/common';
import { MetadataFromClassOrMethod } from '@axisparkjs/common';
import { AuthorizationPolicy } from '../types/authorization-policy';

/** Metadata recorded by {@link Secured} for a class or handler method. */
export interface SecuredMetadata extends MetadataFromClassOrMethod {
    /** Policy classes to evaluate for this target, in declaration order. */
    policies: ClassType<AuthorizationPolicy>[];
}
