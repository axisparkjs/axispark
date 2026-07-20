import { Factory } from '@axisparkjs/common';
import { AxiSparkTestConfig } from './axispark-test-config';
import { AxiSparkContext } from '@axisparkjs/core';
import { ConsoleTransport, LogLevel, SimpleFormatter } from '@axisparkjs/logger';
import { AxiSparkTestCore } from './axispark-test-core';

export class AxiSparkTestFactoryStatic implements Factory<AxiSparkTestCore> {
    public create(config?: AxiSparkTestConfig): AxiSparkTestCore {
        // Perform any necessary setup or configuration here
        const context = new AxiSparkContext({
            banner: false,
            environment: 'test',
            name: 'Test',
            logTransports: [new ConsoleTransport({ formatter: new SimpleFormatter(), minLevel: LogLevel.ERROR })]
        });

        const providers = config?.providers || [];
        providers.forEach((provider) => context.container.bind(provider));

        if (config?.app) config.app.used().forEach((plugin) => context.plugins.register(context, plugin.type, plugin.options));

        return new AxiSparkTestCore(context);
    }
}

export const AxiSparkTestFactory = new AxiSparkTestFactoryStatic();
