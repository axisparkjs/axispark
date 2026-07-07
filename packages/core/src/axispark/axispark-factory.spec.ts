import { AxisparkCore } from './axispark-core';
import { AxisparkFactory } from './axispark-factory';

describe('axisparkFactory', () => {
    it('should create an instance of axisparkCore', () => {
        const axisparkCore = AxisparkFactory.create();
        expect(axisparkCore).toBeInstanceOf(AxisparkCore);
    });
});
