import { HandledResult } from './handled-result';
import { ResultDefinition } from '../../result';

describe('HandledResult', () => {
    it('should extend Result', () => {
        const result = new HandledResult();

        expect(result).toBeInstanceOf(ResultDefinition);
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
