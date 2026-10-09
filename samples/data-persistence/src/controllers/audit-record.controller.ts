import { InjectDataSource, InjectRepository } from '@axisparkjs/data';
import { Body, Controller, Delete, Get, Post } from '@axisparkjs/http';
import { DataSource } from 'typeorm';
import { AuditRecord } from '../entities/audit-record';
import { AuditRecordRepository } from '../repositories/audit-record.repository';

@Controller('audit-records')
export class AuditRecordController {
    constructor(
        @InjectRepository(AuditRecordRepository) private readonly auditRecords: AuditRecordRepository,
        @InjectDataSource('REPORTING') private readonly reportingDataSource: DataSource
    ) {}

    @Post()
    save(@Body() records: AuditRecord[]) {
        return this.auditRecords.save(records);
    }

    @Get()
    find() {
        return this.auditRecords.find({ order: { _id: 'ASC' } });
    }

    @Get('source')
    source() {
        return {
            initialized: this.reportingDataSource.isInitialized,
            database: this.reportingDataSource.options.database
        };
    }

    @Delete()
    async removeAll() {
        const records = await this.auditRecords.find();
        const removed = await this.auditRecords.remove(records);
        return { removed: removed.length };
    }
}
