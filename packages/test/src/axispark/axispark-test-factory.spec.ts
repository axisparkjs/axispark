import { AxiSparkFactory, Pluggable, Plugin } from '@axisparkjs/core';
import { AxiSparkTestFactory } from './axispark-test-factory';
import { Injectable, InjectionToken } from '@axisparkjs/di';
import { AxiSparkTestCore } from './axispark-test-core';

describe('AxiSparkTestFactory', () => {
    it('should create an instance of AxiSparkCore', () => {
        const axisparkCore = AxiSparkTestFactory.create();
        expect(axisparkCore).toBeInstanceOf(AxiSparkTestCore);
    });

    it('should accept override for injections', () => {
        const token = new InjectionToken('TestToken');
        @Injectable()
        class MockProvider {}

        const axisparkCore = AxiSparkTestFactory.create({ providers: [{ token, useClass: MockProvider }] });
        expect(axisparkCore).toBeInstanceOf(AxiSparkTestCore);
    });

    it('should accept override from a created AxisparkCore instance', () => {
        @Plugin()
        class TestPlugin implements Pluggable {
            public onRegister() {}
            public onStart() {}
            public onStop() {}
        }

        const axisparkCore = AxiSparkFactory.create({});
        axisparkCore.use(TestPlugin);

        const axisparkTestCore = AxiSparkTestFactory.create({ app: axisparkCore });

        expect(axisparkTestCore).toBeInstanceOf(AxiSparkTestCore);
        expect(axisparkTestCore.used()).toEqual(axisparkCore.used());
    });
});
