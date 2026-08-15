import { ExecutionContext } from '../execution';
import { ResultDefinition } from './result-definition';

class TestResult extends ResultDefinition {
    public process = jest.fn().mockResolvedValue(undefined);
}

describe('ResultDefinition', () => {
    it('should store the value and response code', () => {
        const result = new TestResult(
            {
                message: 'OK'
            },
            200
        );

        expect(result.value).toEqual({
            message: 'OK'
        });

        expect(result.rc).toBe(200);
    });

    it('should support generic values', () => {
        const result = new TestResult('hello', 200);

        expect(result.value).toBe('hello');
        expect(result.rc).toBe(200);
    });

    it('should support undefined as value', () => {
        const result = new TestResult(undefined, 204);

        expect(result.value).toBeUndefined();
        expect(result.rc).toBe(204);
    });

    it('should call the process implementation with the execution context', async () => {
        const result = new TestResult('test', 200);

        const context = {} as ExecutionContext;

        await result.process(context);

        expect(result.process).toHaveBeenCalledWith(context);
    });
});
