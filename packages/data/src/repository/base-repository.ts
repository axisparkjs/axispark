import { DataSource, FindManyOptions, ObjectLiteral, RemoveOptions, Repository } from 'typeorm';

export abstract class BaseRepository<T extends ObjectLiteral> {
    protected constructor(
        protected readonly entityRepository: Repository<T>,
        protected readonly dataSource: DataSource
    ) {}

    async save(entity: T): Promise<T>;
    async save(entities: T[]): Promise<T[]>;
    async save(entityOrEntities: T | T[]): Promise<T | T[]> {
        if (Array.isArray(entityOrEntities)) {
            return this.entityRepository.save(entityOrEntities);
        }

        return this.entityRepository.save(entityOrEntities);
    }

    async find(options?: FindManyOptions<T>): Promise<T[]> {
        return this.entityRepository.find(options);
    }

    async count(options?: FindManyOptions<T>): Promise<number> {
        return this.entityRepository.count(options);
    }

    async exists(options?: FindManyOptions<T>): Promise<boolean> {
        return this.entityRepository.exists(options);
    }

    async remove(entity: T, options?: RemoveOptions): Promise<T>;
    async remove(entities: T[], options?: RemoveOptions): Promise<T[]>;
    async remove(entityOrEntities: T | T[], options?: RemoveOptions): Promise<T | T[]> {
        if (Array.isArray(entityOrEntities)) {
            return this.entityRepository.remove(entityOrEntities, options);
        }

        return this.entityRepository.remove(entityOrEntities, options);
    }
}
