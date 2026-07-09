import { Factory } from '@axisparkjs/common';
import { AxisparkTestConfig } from './axispark-test-config';
import { AxisparkContext } from '@axisparkjs/core';
import { ConsoleTransport, LogLevel, SimpleFormatter } from '@axisparkjs/logger';
import { AxisparkTestCore } from './axispark-test-core';

export class AxisparkTestFactoryStatic implements Factory<AxisparkTestCore> {
    public create(config?: AxisparkTestConfig): AxisparkTestCore {
        // Perform any necessary setup or configuration here
        const context = new AxisparkContext({
            banner: false,
            environment: 'test',
            name: 'Test',
            logTransports: [new ConsoleTransport({ formatter: new SimpleFormatter(), minLevel: LogLevel.ERROR })]
        });

        const providers = config?.providers || [];
        providers.forEach((provider) => context.container.bind(provider));

        if (config?.app) config.app.used().forEach((plugin) => context.plugins.register(context, plugin.type, plugin.options));

        return new AxisparkTestCore(context);
    }
}

export const AxisparkTestFactory = new AxisparkTestFactoryStatic();
