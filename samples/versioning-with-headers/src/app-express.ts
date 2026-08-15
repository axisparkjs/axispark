import { AxiSparkFactory } from '@axisparkjs/core';
import { HttpPlugin, VersionType } from '@axisparkjs/http';
import { HttpPluginOptionsFactory } from '@axisparkjs/http-express';
import { ConsoleTransport, LogLevel, SimpleFormatter } from '@axisparkjs/logger';

export const app = AxiSparkFactory.create({
    name: 'Versioning with Headers',
    basePath: __dirname,
    logTransports: [
        new ConsoleTransport({
            minLevel: LogLevel.Debug,
            formatter: new SimpleFormatter()
        })
    ]
});
app.use(
    HttpPlugin,
    HttpPluginOptionsFactory.create({
        basePath: '/api',
        version: true,
        versionOptions: {
            type: VersionType.Header,
            header: 'X-API-Version'
        }
    })
);
