import { AxiSparkFactory } from '@axisparkjs/core';
import { ConsoleTransport, LogLevel, SimpleFormatter } from '@axisparkjs/logger';
import { KafkaPlugin, KafkaPluginOptionsFactory } from '@axisparkjs/kafka';
import { SchedulePlugin } from '@axisparkjs/schedule';

export const app = AxiSparkFactory.create({
    name: 'Kafka Connected App',
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
    KafkaPlugin,
    KafkaPluginOptionsFactory.create({
        connections: [
            {
                name: '1',
                config: {
                    brokers: ['localhost:9092'],
                    logLevel: 0
                }
            },
            {
                name: '2',
                config: {
                    brokers: ['localhost:9092'],
                    logLevel: 0
                },
                autoInitialize: false
            },
            {
                name: '3',
                config: {
                    brokers: ['localhost:9092'],
                    logLevel: 0
                },
                autoInitialize: {
                    autoInitializeConsumers: false,
                    autoInitializeProducers: true
                }
            },
            {
                name: '4',
                config: {
                    brokers: ['localhost:9093'],
                    logLevel: 0,
                    retry: { retries: 0 }
                }
            }
        ]
    })
);
