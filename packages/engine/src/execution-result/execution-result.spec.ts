import { ExecutionResult } from './execution-result';

describe('ExecutionResult', () => {
    class TestExecutionResult<T> extends ExecutionResult<T> {
        process = jest.fn().mockResolvedValue(undefined);
    }

    it('should initialize value and rc', () => {
        const result = new TestExecutionResult('hello', 200);

        expect(result.value).toBe('hello');
        expect(result.rc).toBe(200);
    });

    it('should invoke the overridden process method', async () => {
        const context = { requestId: '1' } as any;

        const result = new TestExecutionResult({ ok: true }, 201);

        await result.process(context);

        expect(result.process).toHaveBeenCalledWith(context);
    });

    it('should preserve generic value type', () => {
        const value = {
            id: 1,
            name: 'John',
        };

        const result = new TestExecutionResult(value, 200);

        expect(result.value).toEqual(value);
    });
});