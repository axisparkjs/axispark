import { AxisparkFactory, Pluggable, Plugin } from '@axisparkjs/core';
import { AxisparkTestFactory } from './axispark-test-factory';
import { Injectable, InjectionToken } from '@axisparkjs/di';
import { AxisparkTestCore } from './axispark-test-core';

describe('AxisparkTestFactory', () => {
    it('should create an instance of AxisparkCore', () => {
        const axisparkCore = AxisparkTestFactory.create();
        expect(axisparkCore).toBeInstanceOf(AxisparkTestCore);
    });

    it('should accept override for injections', () => {
        const token = new InjectionToken('TestToken');
        @Injectable()
        class MockProvider {}

        const axisparkCore = AxisparkTestFactory.create({ providers: [{ token, useClass: MockProvider }] });
        expect(axisparkCore).toBeInstanceOf(AxisparkTestCore);
    });

    it('should accept override from a created AxisparkCore instance', () => {
        @Plugin()
        class TestPlugin implements Pluggable {
            public onRegister() {}
            public onStart() {}
            public onStop() {}
        }

        const axisparkCore = AxisparkFactory.create({});
        axisparkCore.use(TestPlugin);

        const axisparkTestCore = AxisparkTestFactory.create({ app: axisparkCore });

        expect(axisparkTestCore).toBeInstanceOf(AxisparkTestCore);
        expect(axisparkTestCore.used()).toEqual(axisparkCore.used());
    });
});
