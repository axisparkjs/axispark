import { Factory } from '@axisparkjs/common';
import { AxiSparkTestConfig } from './axispark-test-config';
import { AxiSparkContext, AxiSparkCore } from '@axisparkjs/core';
import { NullTransport, LogLevel, SimpleFormatter } from '@axisparkjs/logger';

class AxiSparkTestFactoryStatic implements Factory<AxiSparkCore> {
    public create(config?: AxiSparkTestConfig): AxiSparkCore {
        // Perform any necessary setup or configuration here
        const context = new AxiSparkContext(
            {
                ...config?.app?.config,
                banner: false,
                environment: 'test',
                name: 'Test',
                logTransports: [new NullTransport({ formatter: new SimpleFormatter(), minLevel: LogLevel.Error })]
            },
            {
                scanner: 'file-system',
                wait: false
            }
        );

        if (config?.app) config.app.used().forEach((plugin) => context.plugins.register(context, plugin.type, plugin.options));

        const providers = config?.providers || [];
        providers.forEach((provider) => context.container.bind(provider));

        return new AxiSparkCore(context);
    }
}

export const AxiSparkTestFactory = new AxiSparkTestFactoryStatic();
