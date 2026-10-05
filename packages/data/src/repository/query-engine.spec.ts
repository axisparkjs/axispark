import { ObjectLiteral } from 'typeorm';
import { BaseRepository } from './base-repository';
import { MongoQueryEngine } from './mongo-query-engine';
import { QueryEngine } from './query-engine';
import { SQLQueryEngine } from './sql-query-engine';

interface TestEntity extends ObjectLiteral {
    id: number;
}

describe('QueryEngine driver dispatch', () => {
    let sqlQueryEngine: { execute: jest.Mock };
    let mongoQueryEngine: { execute: jest.Mock };
    let engine: QueryEngine;
    const object = {} as BaseRepository<TestEntity>;

    beforeEach(() => {
        sqlQueryEngine = { execute: jest.fn().mockResolvedValue([]) };
        mongoQueryEngine = { execute: jest.fn().mockResolvedValue([]) };
        engine = new QueryEngine(sqlQueryEngine as unknown as SQLQueryEngine, mongoQueryEngine as unknown as MongoQueryEngine);
    });

    it('routes MongoDB data sources to MongoQueryEngine', async () => {
        const classArgs = [{}, { options: { type: 'mongodb' } }];

        await engine.execute(object, 'findById', classArgs, [1]);

        expect(mongoQueryEngine.execute).toHaveBeenCalledWith(object, 'findById', classArgs, [1]);
        expect(sqlQueryEngine.execute).not.toHaveBeenCalled();
    });

    it.each(['mysql', 'postgres', 'cockroachdb', 'sap', 'spanner', 'mariadb', 'sqljs', 'oracle', 'mssql', 'aurora-mysql', 'aurora-postgres', 'better-sqlite3'])(
        'routes the %s driver to SQLQueryEngine',
        async (type) => {
            const classArgs = [{}, { options: { type } }];

            await engine.execute(object, 'findById', classArgs, [1]);

            expect(sqlQueryEngine.execute).toHaveBeenCalledWith(object, 'findById', classArgs, [1]);
            expect(mongoQueryEngine.execute).not.toHaveBeenCalled();
        }
    );

    it('rejects unsupported TypeORM drivers', () => {
        expect(() => engine.execute(object, 'findById', [{}, { options: { type: 'unsupported' } } as any], [1])).toThrow(
            'Unsupported TypeORM driver: unsupported'
        );
    });
});
