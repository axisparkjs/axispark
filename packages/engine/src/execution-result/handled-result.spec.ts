import { HandledResult } from './handled-result';
import { ExecutionResult } from './execution-result';

describe('HandledResult', () => {
    it('should extend ExecutionResult', () => {
        const result = new HandledResult();

        expect(result).toBeInstanceOf(ExecutionResult);
    });

    it('should initialize default values', () => {
        const result = new HandledResult();

        expect(result.value).toBeUndefined();
        expect(result.rc).toBe(-1);
    });

    it('should resolve process()', async () => {
        const result = new HandledResult();

        await expect(result.process()).resolves.toBeUndefined();
    });
});
