import { Executable } from '@axisparkjs/common';
import { Injectable } from '@axisparkjs/di';
import { DataSource, ObjectLiteral } from 'typeorm';
import { BaseRepository } from './base-repository';
import { MongoQueryEngine } from './mongo-query-engine';
import { SQLQueryEngine } from './sql-query-engine';

export { PageRequest } from './query-method-parser';

/** Routes derived repository methods to the engine for the active TypeORM driver. */
@Injectable()
export class QueryEngine implements Executable {
    private readonly sqlDBMS = new Set([
        'mysql',
        'postgres',
        'cockroachdb',
        'sap',
        'spanner',
        'mariadb',
        'sqljs',
        'oracle',
        'mssql',
        'aurora-mysql',
        'aurora-postgres',
        'better-sqlite3'
    ]);
    private readonly mongoDBMS = new Set(['mongodb']);

    constructor(
        private readonly sqlQueryEngine: SQLQueryEngine,
        private readonly mongoQueryEngine: MongoQueryEngine
    ) {}

    public execute<T extends ObjectLiteral>(object: BaseRepository<T>, property: string, classArgs: unknown[], methodArgs: unknown[]): Promise<unknown> {
        const [, dataSource] = classArgs as [unknown, DataSource];
        if (this.sqlDBMS.has(dataSource.options.type)) return this.sqlQueryEngine.execute(object, property, classArgs, methodArgs);
        if (this.mongoDBMS.has(dataSource.options.type)) return this.mongoQueryEngine.execute(object, property, classArgs, methodArgs);

        throw new Error(`Unsupported TypeORM driver: ${dataSource.options.type}`);
    }
}
