import { Metadata } from '@axisparkjs/common';
import { PipeExecutor } from './pipe-executor';
import { PipeStep } from './pipe-step';
import { PipeScope } from './pipe-scope';

describe('PipeExecutor', () => {
    let container: any;
    let core: any;
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

        context = {
            args: [],
            transport: 'http'
        };

        jest.spyOn(Metadata, 'get').mockReturnValue([]);
        jest.spyOn(Metadata, 'get').mockReturnValue([]);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should do nothing when no pipes are registered', () => {
        context.args = ['10'];

        (Metadata.get as jest.Mock).mockReturnValue(undefined);
        (Metadata.get as jest.Mock).mockReturnValue(undefined);

        const result = PipeExecutor.execute(context, handler, core);

        expect(container.resolve).not.toHaveBeenCalled();
        expect(result).toEqual(['10']);
        expect(context.args).toEqual(['10']);
    });

    it('should execute a single pipe step', () => {
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

        container.resolve.mockReturnValue(new Step());

        context.args = ['15'];

        PipeExecutor.execute(context, handler, core);

        expect(container.resolve).toHaveBeenCalledWith(Step);
        expect(context.args[0]).toBe(15);
    });

    it('should execute pipe steps in order', () => {
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

        (Metadata.get as jest.Mock).mockReturnValue([
            {
                scope: PipeScope.Parameter,
                index: 0,
                propertyKey: 'method',
                steps: [TrimStep, UpperStep]
            }
        ]);

        container.resolve.mockReturnValueOnce(new TrimStep()).mockReturnValueOnce(new UpperStep());

        context.args = ['  john  '];

        PipeExecutor.execute(context, handler, core);

        expect(context.args[0]).toBe('JOHN');
    });

    it('should pass parameters to the pipe step', () => {
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

        container.resolve.mockReturnValue(new Step());

        context.args = [5];

        PipeExecutor.execute(context, handler, core);

        expect(execute).toHaveBeenCalledWith(5, expect.any(Object), parameters);
    });

    it('should pass execution context to the pipe step', () => {
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

        container.resolve.mockReturnValue(new Step());

        context.args = ['5'];
        context.transport = 'http';

        PipeExecutor.execute(context, handler, core);

        expect(execute).toHaveBeenCalledWith(
            '5',
            {
                parameter: 'find',
                index: 0,
                originalValue: '5',
                transport: 'http'
            },
            undefined
        );
    });

    it('should propagate errors', () => {
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

        container.resolve.mockReturnValue(new Step());

        context.args = ['5'];

        expect(() => PipeExecutor.execute(context, handler, core)).toThrow('boom');
    });
});
