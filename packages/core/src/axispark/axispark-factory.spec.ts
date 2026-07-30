import { AxiSparkCore } from './axispark-core';
import { AxiSparkFactory } from './axispark-factory';

describe('AxiSparkFactory', () => {
    it('should create an instance of axiSparkCore', () => {
        const axiSparkCore = AxiSparkFactory.create();
        expect(axiSparkCore).toBeInstanceOf(AxiSparkCore);
    });
});
