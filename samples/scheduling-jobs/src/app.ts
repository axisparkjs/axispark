import { AxiSparkFactory } from '@axisparkjs/core';
import { ConsoleTransport, LogLevel, SimpleFormatter } from '@axisparkjs/logger';
import { SchedulePlugin } from '@axisparkjs/schedule';

export const app = AxiSparkFactory.create({
    name: 'Scheduling Jobs',
    basePath: __dirname,
    logTransports: [
        new ConsoleTransport({
            minLevel: LogLevel.Trace,
            formatter: new SimpleFormatter()
        })
    ]
});
app.use(SchedulePlugin);
