import { Repository as DataRepository, BaseRepository } from '@axisparkjs/data';
import { DataSource, Repository } from 'typeorm';
import { AuditRecord } from '../entities/audit-record';

@DataRepository({ entity: AuditRecord })
export class AuditRecordRepository extends BaseRepository<AuditRecord> {
    constructor(entityRepository: Repository<AuditRecord>, dataSource: DataSource) {
        super(entityRepository, dataSource);
    }
}
