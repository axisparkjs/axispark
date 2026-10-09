import { ClassType } from '@axisparkjs/common';
import { MetadataFromClass } from '@axisparkjs/common';
import { ObjectLiteral } from 'typeorm';

export interface RepositoryMetadata extends MetadataFromClass {
    /** Entity class this repository manages. */
    entity: ClassType<ObjectLiteral>;
}
