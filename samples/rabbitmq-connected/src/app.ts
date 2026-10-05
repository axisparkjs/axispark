import { AxiSparkFactory } from '@axisparkjs/core';
import { ConsoleTransport, LogLevel, SimpleFormatter } from '@axisparkjs/logger';
import { RabbitMQPlugin, RabbitMQPluginOptionsFactory } from '@axisparkjs/rabbitmq';
import { SchedulePlugin } from '@axisparkjs/schedule';

export const app = AxiSparkFactory.create({
    name: 'RabbitMQ Connected App',
    basePath: __dirname,
    logTransports: [
        new ConsoleTransport({
            minLevel: LogLevel.Trace,
            formatter: new SimpleFormatter()
        })
    ]
});
app.use(SchedulePlugin);
app.use(
    RabbitMQPlugin,
    RabbitMQPluginOptionsFactory.create({
        connections: [
            {
                name: '1',
                url: 'amqp://guest:guest@localhost:5672',
                options: {
                    heartbeatIntervalInSeconds: 5,
                    reconnectTimeInSeconds: 5
                }
            },
            {
                name: '2',
                url: 'amqp://guest:guest@localhost:5672'
            },
            {
                name: '3',
                url: 'FAKE_URL',
                options: {
                    heartbeatIntervalInSeconds: 100
                }
            }
        ]
    })
);
