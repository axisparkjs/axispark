import { AxiSparkFactory } from '@axisparkjs/core';
import { ConsoleTransport, LogLevel, SimpleFormatter } from '@axisparkjs/logger';
import { HelloWorldPlugin } from './plugin';

export const app = AxiSparkFactory.create({
    name: 'Hello World App',
    basePath: __dirname,
    logTransports: [
        new ConsoleTransport({
            minLevel: LogLevel.Info,
            formatter: new SimpleFormatter()
        })
    ]
});
app.use(HelloWorldPlugin);
