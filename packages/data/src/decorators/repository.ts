import { Metadata } from '@axisparkjs/common';
import { RepositoryMetadata } from '../metadata/repository-metadata';
import { MetadataKeys } from '@axisparkjs/common';
import { Constructable } from '@axisparkjs/di';

/**
 * Marks a class as a repository for an entity and registers it for automatic generation.
 * The class should extend {@link BaseRepository} and its entity must be part of
 * one configured TypeORM data source.
 *
 * @example
 * ```ts
 * @Repository({ entity: User })
 * export class UserRepository extends BaseRepository<User> {}
 * ```
 *
 * @param data Repository metadata containing the entity class.
 * @returns A class decorator that records the metadata and registers the class for injection.
 */
export function Repository(data: Omit<RepositoryMetadata, 'target'>): ClassDecorator {
    return (target) => {
        const metadata: RepositoryMetadata = {
            target: Metadata.normalizeTarget(target),
            ...data
        };
        Constructable(MetadataKeys.INJECTABLE)(target);
        Metadata.define(MetadataKeys.REPOSITORY, metadata, target);
    };
}
