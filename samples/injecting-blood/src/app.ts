import { AxiSparkFactory } from '@axisparkjs/core';
import { ConsoleTransport, LogLevel, SimpleFormatter } from '@axisparkjs/logger';
import { InjectingBlood1Plugin, InjectingBlood2Plugin, InjectingBlood3Plugin } from './plugins';

export const app = AxiSparkFactory.create({
    name: 'Injecting Blood App',
    basePath: __dirname,
    logTransports: [
        new ConsoleTransport({
            minLevel: LogLevel.Info,
            formatter: new SimpleFormatter()
        })
    ]
});
app.use(InjectingBlood1Plugin);
app.use(InjectingBlood2Plugin);
app.use(InjectingBlood3Plugin);
