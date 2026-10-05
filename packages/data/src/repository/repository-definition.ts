import { ClassType } from '@axisparkjs/common';
import { ObjectLiteral } from 'typeorm';

/** Runtime description of a repository class and its generated implementation. */
export class RepositoryDefinition {
    constructor(
        /** Decorated repository class used as the dependency injection token. */
        public readonly target: ClassType,
        /** Entity handled by this repository. */
        public readonly entity: ClassType<ObjectLiteral>,
        /** Name of the configured TypeORM data source containing the entity. */
        public readonly dataSourceName: string,
        /** Proxy-backed repository instance registered with the application container. */
        public readonly implementation: object
    ) {}
}
