import { Executable } from '@axisparkjs/common';
import { HttpEngine } from './http-engine';
import { HttpContext } from '../types';
import { ExecutionEngine } from '@axisparkjs/engine';
import { VersionGenerator, VersionProcessor } from '../version';

describe('HttpEngine', () => {
    let httpEngine: HttpEngine;
    let executionEngine: jest.Mocked<ExecutionEngine>;
    let versionGenerator: jest.Mocked<VersionGenerator>;
    let versionProcessor: jest.Mocked<VersionProcessor>;

    beforeEach(() => {
        executionEngine = {
            execute: jest.fn().mockResolvedValue(undefined)
        } as unknown as jest.Mocked<ExecutionEngine>;

        versionGenerator = {
            generate: jest.fn()
        } as unknown as jest.Mocked<VersionGenerator>;

        versionProcessor = {
            process: jest.fn()
        } as unknown as jest.Mocked<VersionProcessor>;

        httpEngine = new HttpEngine(
            executionEngine,
            versionGenerator,
            versionProcessor
        );
    });

    it('should generate and process the version before executing the engine', async () => {
        const context = {} as HttpContext;
        const versionDefinition = {} as ReturnType<
            VersionGenerator['generate']
        >;

        versionGenerator.generate.mockReturnValue(versionDefinition);

        await httpEngine.execute(context);

        expect(versionGenerator.generate).toHaveBeenCalledTimes(1);
        expect(versionGenerator.generate).toHaveBeenCalledWith(context);

        expect(versionProcessor.process).toHaveBeenCalledTimes(1);
        expect(versionProcessor.process).toHaveBeenCalledWith(
            versionDefinition,
            context
        );

        expect(executionEngine.execute).toHaveBeenCalledTimes(1);
        expect(executionEngine.execute).toHaveBeenCalledWith(context);
    });

    it('should execute the execution engine after processing the version', async () => {
        const context = {} as HttpContext;
        const versionDefinition = {} as ReturnType<
            VersionGenerator['generate']
        >;

        versionGenerator.generate.mockReturnValue(versionDefinition);

        const calls: string[] = [];

        versionGenerator.generate.mockImplementation(() => {
            calls.push('generate');
            return versionDefinition;
        });

        versionProcessor.process.mockImplementation(() => {
            calls.push('process');
        });

        executionEngine.execute.mockImplementation(async () => {
            calls.push('execute');
        });

        await httpEngine.execute(context);

        expect(calls).toEqual([
            'generate',
            'process',
            'execute'
        ]);
    });

    it('should propagate an error when version generation fails', async () => {
        const context = {} as HttpContext;
        const error = new Error('Version generation failed');

        versionGenerator.generate.mockImplementation(() => {
            throw error;
        });

        await expect(httpEngine.execute(context)).rejects.toThrow(error);

        expect(versionProcessor.process).not.toHaveBeenCalled();
        expect(executionEngine.execute).not.toHaveBeenCalled();
    });

    it('should propagate an error when version processing fails', async () => {
        const context = {} as HttpContext;
        const versionDefinition = {} as ReturnType<
            VersionGenerator['generate']
        >;
        const error = new Error('Version processing failed');

        versionGenerator.generate.mockReturnValue(versionDefinition);
        versionProcessor.process.mockImplementation(() => {
            throw error;
        });

        await expect(httpEngine.execute(context)).rejects.toThrow(error);

        expect(versionGenerator.generate).toHaveBeenCalledWith(context);
        expect(executionEngine.execute).not.toHaveBeenCalled();
    });

    it('should propagate an error when execution fails', async () => {
        const context = {} as HttpContext;
        const versionDefinition = {} as ReturnType<
            VersionGenerator['generate']
        >;
        const error = new Error('Execution failed');

        versionGenerator.generate.mockReturnValue(versionDefinition);
        executionEngine.execute.mockRejectedValue(error);

        await expect(httpEngine.execute(context)).rejects.toThrow(error);

        expect(versionGenerator.generate).toHaveBeenCalledWith(context);
        expect(versionProcessor.process).toHaveBeenCalledWith(
            versionDefinition,
            context
        );
    });

    it('should implement Executable', () => {
        expect(httpEngine).toBeInstanceOf(HttpEngine);

        const executable: Executable = httpEngine;

        expect(executable.execute).toBeInstanceOf(Function);
    });
});