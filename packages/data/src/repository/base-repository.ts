import { DataSource, FindManyOptions, ObjectLiteral, RemoveOptions, Repository } from 'typeorm';

/**
 * Shared TypeORM-backed repository operations. Extend this class from a class
 * decorated with `@Repository({ entity })` to add application-specific methods
 * and declare generated query methods.
 */
export abstract class BaseRepository<T extends ObjectLiteral> {
    protected constructor(
        /** TypeORM repository selected for the decorated entity. */
        protected readonly entityRepository: Repository<T>,
        /** Data source that owns the decorated entity. */
        protected readonly dataSource: DataSource
    ) {}

    /** Saves one entity using the configured TypeORM repository. */
    async save(entity: T): Promise<T>;
    /** Saves multiple entities using the configured TypeORM repository. */
    async save(entities: T[]): Promise<T[]>;
    async save(entityOrEntities: T | T[]): Promise<T | T[]> {
        if (Array.isArray(entityOrEntities)) {
            return this.entityRepository.save(entityOrEntities);
        }

        return this.entityRepository.save(entityOrEntities);
    }

    /** Finds entities using TypeORM {@link https://typeorm.io/docs/working-with-entity-manager/find-options/ FindManyOptions}. */
    async find(options?: FindManyOptions<T>): Promise<T[]> {
        return this.entityRepository.find(options);
    }

    /** Counts entities matching TypeORM find options. */
    async count(options?: FindManyOptions<T>): Promise<number> {
        return this.entityRepository.count(options);
    }

    /** Returns whether at least one entity matches TypeORM find options. */
    async exists(options?: FindManyOptions<T>): Promise<boolean> {
        return this.entityRepository.exists(options);
    }

    /** Removes one entity and resolves with the removed entity. */
    async remove(entity: T, options?: RemoveOptions): Promise<T>;
    /** Removes multiple entities and resolves with the removed entities. */
    async remove(entities: T[], options?: RemoveOptions): Promise<T[]>;
    async remove(entityOrEntities: T | T[], options?: RemoveOptions): Promise<T | T[]> {
        if (Array.isArray(entityOrEntities)) {
            return this.entityRepository.remove(entityOrEntities, options);
        }

        return this.entityRepository.remove(entityOrEntities, options);
    }
}
