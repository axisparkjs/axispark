import { AxiSparkFactory } from '@axisparkjs/core';
import { HttpPlugin } from '@axisparkjs/http';
import { HttpPluginOptionsFactory } from '@axisparkjs/http-express';
import { ConsoleTransport, LogLevel, SimpleFormatter } from '@axisparkjs/logger';

export const app = AxiSparkFactory.create({
    name: 'TODO Crud',
    basePath: __dirname,
    logTransports: [
        new ConsoleTransport({
            minLevel: LogLevel.Info,
            formatter: new SimpleFormatter()
        })
    ]
});
app.use(
    HttpPlugin,
    HttpPluginOptionsFactory.create({
        session: true,
        sessionOptions: {
            secret: 'secret',
            resave: false,
            saveUninitialized: true
        },
        cookies: true
    })
);
