import { DataSource, FindManyOptions, ObjectLiteral, RemoveOptions, Repository } from 'typeorm';
import { BaseRepository } from './base-repository';

interface TestEntity extends ObjectLiteral {
    id: number;
}

class TestRepository extends BaseRepository<TestEntity> {
    constructor(entityRepository: Repository<TestEntity>) {
        super(entityRepository, {} as DataSource);
    }
}

describe('BaseRepository', () => {
    let repository: TestRepository;
    let entityRepository: any;

    beforeEach(() => {
        entityRepository = {
            save: jest.fn().mockImplementation(async (value) => value),
            find: jest.fn().mockResolvedValue([]),
            count: jest.fn().mockResolvedValue(0),
            exists: jest.fn().mockResolvedValue(false),
            remove: jest.fn().mockImplementation(async (value) => value)
        };
        repository = new TestRepository(entityRepository as Repository<TestEntity>);
    });

    it('delegates save for one entity and an array of entities', async () => {
        const entity = { id: 1 };
        const entities = [entity, { id: 2 }];

        await expect(repository.save(entity)).resolves.toBe(entity);
        await expect(repository.save(entities)).resolves.toBe(entities);

        expect(entityRepository.save).toHaveBeenNthCalledWith(1, entity);
        expect(entityRepository.save).toHaveBeenNthCalledWith(2, entities);
    });

    it('passes find options through and returns the matching entities', async () => {
        const options: FindManyOptions<TestEntity> = { take: 5, skip: 10 };
        const entities = [{ id: 1 }];
        entityRepository.find.mockResolvedValue(entities);

        await expect(repository.find(options)).resolves.toBe(entities);
        expect(entityRepository.find).toHaveBeenCalledWith(options);
    });

    it('delegates count and exists with their options', async () => {
        const options: FindManyOptions<TestEntity> = { where: { id: 1 } };
        entityRepository.count.mockResolvedValue(3);
        entityRepository.exists.mockResolvedValue(true);

        await expect(repository.count(options)).resolves.toBe(3);
        await expect(repository.exists(options)).resolves.toBe(true);

        expect(entityRepository.count).toHaveBeenCalledWith(options);
        expect(entityRepository.exists).toHaveBeenCalledWith(options);
    });

    it('removes and returns one entity', async () => {
        const entity = { id: 1 };
        const options: RemoveOptions = { listeners: false };

        await expect(repository.remove(entity, options)).resolves.toBe(entity);
        expect(entityRepository.remove).toHaveBeenCalledWith(entity, options);
    });

    it('removes and returns an array of entities', async () => {
        const entities = [{ id: 1 }, { id: 2 }];

        await expect(repository.remove(entities)).resolves.toBe(entities);
        expect(entityRepository.remove).toHaveBeenCalledWith(entities, undefined);
    });
});
