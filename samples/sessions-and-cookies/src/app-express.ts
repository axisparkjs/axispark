import { AxiSparkFactory } from '@axisparkjs/core';
import { HttpPlugin } from '@axisparkjs/http';
import { HttpPluginOptionsFactory } from '@axisparkjs/http-express';
import { ConsoleTransport, LogLevel, SimpleFormatter } from '@axisparkjs/logger';

export const app = AxiSparkFactory.create({
    name: 'Sessions and Cookies',
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
            secret: 'secretwithatleast32characters!!!',
            resave: false,
            saveUninitialized: true
        },
        cookies: true,
        cookiesOptions: {
            secret: 'secretwithatleast32characters!!!'
        }
    })
);
