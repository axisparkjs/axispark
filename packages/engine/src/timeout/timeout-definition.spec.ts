import { TimeoutDefinition } from './timeout-definition';

describe('TimeoutDefinition', () => {
    it('should create a timeout with the given time', () => {
        const timeout = new TimeoutDefinition(5000);

        expect(timeout.time).toBe(5000);
    });

    it('should allow a timeout of zero', () => {
        const timeout = new TimeoutDefinition(0);

        expect(timeout.time).toBe(0);
    });
});
