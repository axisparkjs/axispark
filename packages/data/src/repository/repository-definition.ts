import { ClassType } from '@axisparkjs/common';
import { ObjectLiteral } from 'typeorm';

export class RepositoryDefinition {
    constructor(
        public readonly target: ClassType,
        public readonly entity: ClassType<ObjectLiteral>,
        public readonly dataSourceName: string,
        public readonly implementation: object
    ) {}
}
