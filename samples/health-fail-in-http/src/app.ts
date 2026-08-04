import { AxiSparkFactory } from '@axisparkjs/core';
import { HttpPlugin } from '@axisparkjs/http';
import { HttpPluginOptionsFactory } from '@axisparkjs/http-express';
import { ConsoleTransport, LogLevel, SimpleFormatter } from '@axisparkjs/logger';
import { BadPlugin } from './plugin';

export const app = AxiSparkFactory.create({
    name: 'Health fail in HTTP',
    basePath: __dirname,
    logTransports: [
        new ConsoleTransport({
            minLevel: LogLevel.Debug,
            formatter: new SimpleFormatter()
        })
    ]
});
app.use(BadPlugin);
app.use(
    HttpPlugin,
    HttpPluginOptionsFactory.create({
        basePath: '/api',
        healthChecks: true
    })
);
