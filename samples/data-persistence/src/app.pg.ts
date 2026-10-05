import { AxiSparkFactory } from '@axisparkjs/core';
import { DataPlugin, DataPluginOptionsFactory } from '@axisparkjs/data';
import { HttpPlugin } from '@axisparkjs/http';
import { HttpPluginOptionsFactory } from '@axisparkjs/http-express';
import { Customer } from './entities/customer';
import { AuditRecord } from './entities/audit-record';
import { ConsoleTransport, LogLevel, SimpleFormatter } from '@axisparkjs/logger';

const dataSource = (entities: Function[]) => ({
    type: 'postgres' as const,
    host: 'localhost',
    port: 5432,
    username: 'axispark',
    password: 'axispark',
    database: 'axispark_testing',
    entities,
    synchronize: true,
    logging: false
});

export const app = AxiSparkFactory.create({
    name: 'Data Persistence App',
    basePath: __dirname,
    logTransports: [
        new ConsoleTransport({
            minLevel: LogLevel.Debug,
            formatter: new SimpleFormatter()
        })
    ]
});

app.use(
    DataPlugin,
    DataPluginOptionsFactory.create({
        dataSources: [
            { name: 'PRIMARY', options: dataSource([Customer]) },
            { name: 'REPORTING', options: dataSource([AuditRecord]) }
        ]
    })
);

app.use(
    HttpPlugin,
    HttpPluginOptionsFactory.create({
        basePath: '/api'
    })
);
