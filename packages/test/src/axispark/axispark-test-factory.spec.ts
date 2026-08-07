import { AxiSparkFactory, Pluggable, Plugin } from '@axisparkjs/core';
import { AxiSparkTestFactory } from './axispark-test-factory';
import { Injectable, InjectableScope, InjectionToken } from '@axisparkjs/di';
import { AxiSparkCore } from '@axisparkjs/core';

describe('AxiSparkTestFactory', () => {
    it('should create an instance of AxiSparkCore', () => {
        const axisparkCore = AxiSparkTestFactory.create();
        expect(axisparkCore).toBeInstanceOf(AxiSparkCore);
    });

    it('should accept override for injections', () => {
        const token = new InjectionToken('TestToken');
        @Injectable()
        class MockProvider {}

        const axisparkCore = AxiSparkTestFactory.create({ providers: [{ token, useClass: MockProvider, scope: InjectableScope.Singleton }] });
        expect(axisparkCore).toBeInstanceOf(AxiSparkCore);
    });

    it('should accept override from a created AxisparkCore instance', () => {
        @Plugin()
        class TestPlugin extends Pluggable {
            public onRegister() {}
            public onStart() {}
            public onStop() {}
        }

        const axisparkCore = AxiSparkFactory.create({});
        axisparkCore.use(TestPlugin);

        const axisparkTestCore = AxiSparkTestFactory.create({ app: axisparkCore });

        expect(axisparkTestCore).toBeInstanceOf(AxiSparkCore);
        expect(axisparkTestCore.used()).toEqual(axisparkCore.used());
        expect(axisparkTestCore.config.basePath).toEqual(axisparkCore.config.basePath);
    });
});
