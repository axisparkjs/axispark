import { AxiSparkFactory } from '@axisparkjs/core';
import { ConsoleTransport, LogLevel, SimpleFormatter } from '@axisparkjs/logger';
import { HelloWorldPlugin } from './plugin';

export const app = AxiSparkFactory.create({
    name: 'Hello World App',
    logTransports: [
        new ConsoleTransport({
            minLevel: LogLevel.INFO,
            formatter: new SimpleFormatter()
        })
    ]
});
app.use(HelloWorldPlugin);
