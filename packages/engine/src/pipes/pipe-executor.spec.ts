import { Metadata } from '@axisparkjs/common';
import { PipeExecutor } from './pipe-executor';
import { PipeStep } from './pipe-step';
import { PipeScope } from './pipe-scope';

describe('PipeExecutor', () => {
    let container: any;
    let core: any;
    let scope: any;
    let handler: any;
    let context: any;

    beforeEach(() => {
        container = {
            resolve: jest.fn()
        };

        core = {
            container
        };

        handler = {
            target: class Test {},
            method: 'method'
        };

        scope = {
            scope: 'test'
        };

        context = {
            args: [],
            transport: 'http',
            scope
        };

        jest.spyOn(Metadata, 'get').mockReturnValue([]);
        jest.spyOn(Metadata, 'get').mockReturnValue([]);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should do nothing when no pipes are registered', async () => {
        context.args = ['10'];

        (Metadata.get as jest.Mock).mockReturnValue(undefined);
        (Metadata.get as jest.Mock).mockReturnValue(undefined);

        const result = await PipeExecutor.execute(context, handler, core);

        expect(container.resolve).not.toHaveBeenCalled();
        expect(result).toEqual(['10']);
        expect(context.args).toEqual(['10']);
    });

    it('should execute a single pipe step', async () => {
        class Step implements PipeStep {
            execute(value: any) {
                return Number(value);
            }
        }

        (Metadata.get as jest.Mock).mockReturnValue([
            {
                scope: PipeScope.Parameter,
                index: 0,
                propertyKey: 'method',
                steps: [Step]
            }
        ]);

        container.resolve.mockResolvedValue(new Step());

        context.args = ['15'];

        await PipeExecutor.execute(context, handler, core);

        expect(container.resolve).toHaveBeenCalledWith(Step, scope);
        expect(context.args[0]).toBe(15);
    });

    it('should execute pipe steps in order', async () => {
        class TrimStep implements PipeStep {
            execute(value: any) {
                return value.trim();
            }
        }

        class UpperStep implements PipeStep {
            execute(value: any) {
                return value.toUpperCase();
            }
        }

        (Metadata.get as jest.Mock).mockReturnValueOnce(undefined).mockReturnValueOnce([
            {
                scope: PipeScope.Parameter,
                index: 0,
                propertyKey: 'method',
                steps: [TrimStep, UpperStep]
            }
        ]);

        container.resolve.mockResolvedValueOnce(new TrimStep()).mockResolvedValueOnce(new UpperStep());

        context.args = ['  john  '];

        await PipeExecutor.execute(context, handler, core);

        expect(context.args[0]).toBe('JOHN');
    });

    it('should pass parameters to the pipe step', async () => {
        const execute = jest.fn((v) => v);

        class Step implements PipeStep {
            execute = execute;
        }

        const parameters = {
            value: 10
        };

        (Metadata.get as jest.Mock).mockReturnValue([
            {
                scope: PipeScope.Parameter,
                index: 0,
                propertyKey: 'method',
                steps: [
                    {
                        pipeStep: Step,
                        pipeStepParameters: parameters
                    }
                ]
            }
        ]);

        container.resolve.mockResolvedValue(new Step());

        context.args = [5];

        await PipeExecutor.execute(context, handler, core);

        expect(execute).toHaveBeenCalledWith(5, expect.any(Object), parameters);
    });

    it('should pass execution context to the pipe step', async () => {
        const execute = jest.fn((v) => v);

        class Step implements PipeStep {
            execute = execute;
        }

        handler.method = 'find';

        (Metadata.get as jest.Mock).mockReturnValue([
            {
                scope: PipeScope.Parameter,
                index: 0,
                propertyKey: 'find',
                steps: [Step]
            }
        ]);

        container.resolve.mockResolvedValue(new Step());

        context.args = ['5'];
        context.transport = 'http';

        await PipeExecutor.execute(context, handler, core);

        expect(execute).toHaveBeenCalledWith(
            '5',
            {
                parameter: 'find',
                index: 0,
                originalValue: '5',
                scope,
                transport: 'http'
            },
            undefined
        );
    });

    it('should propagate errors', async () => {
        class Step implements PipeStep {
            execute() {
                throw new Error('boom');
            }
        }

        (Metadata.get as jest.Mock).mockReturnValue([
            {
                scope: PipeScope.Parameter,
                index: 0,
                propertyKey: 'method',
                steps: [Step]
            }
        ]);

        container.resolve.mockResolvedValue(new Step());

        context.args = ['5'];

        await expect(PipeExecutor.execute(context, handler, core)).rejects.toThrow('boom');
    });
});
