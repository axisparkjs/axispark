import { AxiSparkFactory } from '@axisparkjs/core';
import { HttpPlugin, VersionType } from '@axisparkjs/http';
import { HttpPluginOptionsFactory } from '@axisparkjs/http-express';
import { ConsoleTransport, LogLevel, SimpleFormatter } from '@axisparkjs/logger';

export const app = AxiSparkFactory.create({
    name: 'Versioning and Timeouts',
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
            type: VersionType.Uri,
            defaultVersion: '1'
        },
        timeout: true,
        timeoutOptions: {
            time: 300,
            message: (time: number) => `Request timeout after ${time} ms`
        }
    })
);
