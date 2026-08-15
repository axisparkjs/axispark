import { Executable } from '@axisparkjs/common';
import { HttpEngine } from './http-engine';
import { HttpContext } from '../types';
import { ExecutionEngine } from '@axisparkjs/engine';
import { VersionGenerator, VersionProcessor, VersionDefinition } from '../version';
import { RouteDefinition } from '../routes';

describe('HttpEngine', () => {
    let httpEngine: HttpEngine;
    let executionEngine: jest.Mocked<ExecutionEngine>;
    let versionGenerator: jest.Mocked<VersionGenerator>;
    let versionProcessor: jest.Mocked<VersionProcessor>;

    const createContext = (): Pick<HttpContext, 'request' | 'response' | 'session'> => ({
        request: {} as any,
        response: {} as any,
        session: {} as any
    });

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

        httpEngine = new HttpEngine(executionEngine, versionGenerator, versionProcessor);
    });

    describe('execute', () => {
        it('should generate and process the version before executing the engine', async () => {
            const context = {
                ...createContext(),
                target: class TestController {},
                propertyKey: 'test',
                scopedContainer: {} as any,
                transport: undefined,
                version: undefined,
                error: undefined
            } as any as HttpContext;

            const versionDefinition = new VersionDefinition(['1']);

            versionGenerator.generate.mockReturnValue(versionDefinition);

            await httpEngine.execute(context);

            expect(versionGenerator.generate).toHaveBeenCalledTimes(1);
            expect(versionGenerator.generate).toHaveBeenCalledWith(context);

            expect(versionProcessor.process).toHaveBeenCalledTimes(1);
            expect(versionProcessor.process).toHaveBeenCalledWith(versionDefinition, context);

            expect(context.version).toBe(versionDefinition);

            expect(executionEngine.execute).toHaveBeenCalledTimes(1);
            expect(executionEngine.execute).toHaveBeenCalledWith(context);
        });

        it('should assign the version definition to the context before execution', async () => {
            const context = {
                ...createContext(),
                version: undefined
            } as HttpContext;

            const versionDefinition = new VersionDefinition(['1']);

            versionGenerator.generate.mockReturnValue(versionDefinition);

            executionEngine.execute.mockImplementation(async (receivedContext) => {
                expect((receivedContext as any).version).toBe(versionDefinition);
            });

            await httpEngine.execute(context);

            expect(context.version).toBe(versionDefinition);
        });

        it('should execute in the order generate, process, assign version and execute', async () => {
            const context = {
                ...createContext(),
                version: undefined
            } as HttpContext;

            const versionDefinition = new VersionDefinition(['2']);
            const calls: string[] = [];

            versionGenerator.generate.mockImplementation(() => {
                calls.push('generate');
                return versionDefinition;
            });

            versionProcessor.process.mockImplementation(() => {
                calls.push('process');
            });

            executionEngine.execute.mockImplementation(async () => {
                expect(context.version).toBe(versionDefinition);
                calls.push('execute');
            });

            await httpEngine.execute(context);

            expect(calls).toEqual(['generate', 'process', 'execute']);
        });

        it('should propagate an error when version generation fails', async () => {
            const context = {
                ...createContext()
            } as HttpContext;

            const error = new Error('Version generation failed');

            versionGenerator.generate.mockImplementation(() => {
                throw error;
            });

            await expect(httpEngine.execute(context)).rejects.toThrow(error);

            expect(versionProcessor.process).not.toHaveBeenCalled();
            expect(executionEngine.execute).not.toHaveBeenCalled();
        });

        it('should propagate an error when version processing fails', async () => {
            const context = {
                ...createContext(),
                version: undefined
            } as HttpContext;

            const versionDefinition = new VersionDefinition(['1']);
            const error = new Error('Version processing failed');

            versionGenerator.generate.mockReturnValue(versionDefinition);

            versionProcessor.process.mockImplementation(() => {
                throw error;
            });

            await expect(httpEngine.execute(context)).rejects.toThrow(error);

            expect(versionGenerator.generate).toHaveBeenCalledWith(context);
            expect(context.version).toBeUndefined();
            expect(executionEngine.execute).not.toHaveBeenCalled();
        });

        it('should propagate an error when execution fails', async () => {
            const context = {
                ...createContext(),
                version: undefined
            } as HttpContext;

            const versionDefinition = new VersionDefinition(['1']);
            const error = new Error('Execution failed');

            versionGenerator.generate.mockReturnValue(versionDefinition);
            executionEngine.execute.mockRejectedValue(error);

            await expect(httpEngine.execute(context)).rejects.toThrow(error);

            expect(versionGenerator.generate).toHaveBeenCalledWith(context);

            expect(versionProcessor.process).toHaveBeenCalledWith(versionDefinition, context);

            expect(context.version).toBe(versionDefinition);
        });

        it('should support an undefined version definition', async () => {
            const context = {
                ...createContext(),
                version: undefined
            } as HttpContext;

            versionGenerator.generate.mockReturnValue(undefined);

            await httpEngine.execute(context);

            expect(versionProcessor.process).toHaveBeenCalledWith(undefined, context);

            expect(context.version).toBeUndefined();

            expect(executionEngine.execute).toHaveBeenCalledWith(context);
        });
    });

    describe('versionMapping', () => {
        const createRoute = (versions: string[] | undefined, handler = jest.fn().mockResolvedValue(undefined)) => {
            return {
                versions,
                handler,
                httpMethod: 'GET',
                path: '/users',
                target: class TestController {}
            } as unknown as RouteDefinition;
        };

        it('should resolve the requested version and execute the matching route', async () => {
            const context = createContext();

            versionProcessor.process.mockImplementation((versionDefinition) => {
                versionDefinition?.setVersion('2');
            });

            const routeV1 = createRoute(['1']);
            const routeV2 = createRoute(['2']);

            const routes = [routeV1, routeV2];

            await httpEngine.versionMapping(routes, context);

            expect(versionProcessor.process).toHaveBeenCalledTimes(1);
            expect(versionProcessor.process).toHaveBeenCalledWith(expect.any(VersionDefinition), expect.objectContaining(context));

            expect(routeV1.handler).not.toHaveBeenCalled();
            expect(routeV2.handler).toHaveBeenCalledTimes(1);
            expect(routeV2.handler).toHaveBeenCalledWith(context);
        });

        it('should create a temporary VersionDefinition for version resolution', async () => {
            const context = createContext();

            versionProcessor.process.mockImplementation((definition) => {
                expect(definition).toBeInstanceOf(VersionDefinition);
                expect(definition).not.toBeUndefined();
            });

            const route = createRoute(['1']);

            await httpEngine.versionMapping([route], context);

            expect(versionProcessor.process).toHaveBeenCalledTimes(1);

            const [definition] = versionProcessor.process.mock.calls[0];

            expect(definition).toBeInstanceOf(VersionDefinition);
            expect(definition?.acceptedVersions).toEqual([]);
        });

        it('should pass a copy of the context to the version processor', async () => {
            const context = createContext();

            versionProcessor.process.mockImplementation((_definition, processedContext) => {
                expect(processedContext).not.toBe(context);
                expect(processedContext).toEqual(context);
            });

            const route = createRoute(['1']);

            await httpEngine.versionMapping([route], context);

            expect(versionProcessor.process).toHaveBeenCalledTimes(1);
        });

        it('should select the default route when the requested version is not found', async () => {
            const context = createContext();

            versionProcessor.process.mockImplementation((definition) => {
                definition?.setVersion('3');
            });

            const routeV1 = createRoute(['1']);
            const defaultRoute = createRoute(['default']);
            const routeV2 = createRoute(['2']);

            await httpEngine.versionMapping([routeV1, defaultRoute, routeV2], context);

            expect(routeV1.handler).not.toHaveBeenCalled();
            expect(defaultRoute.handler).toHaveBeenCalledTimes(1);
            expect(defaultRoute.handler).toHaveBeenCalledWith(context);
            expect(routeV2.handler).not.toHaveBeenCalled();
        });

        it('should select the first route when no version or default route matches', async () => {
            const context = createContext();

            versionProcessor.process.mockImplementation((definition) => {
                definition?.setVersion('3');
            });

            const routeV1 = createRoute(['1']);
            const routeV2 = createRoute(['2']);

            await httpEngine.versionMapping([routeV1, routeV2], context);

            expect(routeV1.handler).toHaveBeenCalledTimes(1);
            expect(routeV1.handler).toHaveBeenCalledWith(context);
            expect(routeV2.handler).not.toHaveBeenCalled();
        });

        it('should select the first route when routes have no versions', async () => {
            const context = createContext();

            versionProcessor.process.mockImplementation((definition) => {
                definition?.setVersion('1');
            });

            const routeWithoutVersions = createRoute(undefined);
            const secondRoute = createRoute(['2']);

            await httpEngine.versionMapping([routeWithoutVersions, secondRoute], context);

            expect(routeWithoutVersions.handler).toHaveBeenCalledTimes(1);
            expect(secondRoute.handler).not.toHaveBeenCalled();
        });

        it('should prefer an exact version match over the default route', async () => {
            const context = createContext();

            versionProcessor.process.mockImplementation((definition) => {
                definition?.setVersion('2');
            });

            const defaultRoute = createRoute(['default']);
            const matchingRoute = createRoute(['2']);

            await httpEngine.versionMapping([defaultRoute, matchingRoute], context);

            expect(matchingRoute.handler).toHaveBeenCalledTimes(1);
            expect(defaultRoute.handler).not.toHaveBeenCalled();
        });

        it('should pass the original context to the selected route handler', async () => {
            const context = createContext();

            versionProcessor.process.mockImplementation((definition) => {
                definition?.setVersion('1');
            });

            const route = createRoute(['1']);

            await httpEngine.versionMapping([route], context);

            expect(route.handler).toHaveBeenCalledWith(context);
            expect((route.handler as jest.Mock).mock.calls[0][0]).toBe(context);
        });

        it('should propagate an error when version processing fails', async () => {
            const context = createContext();
            const error = new Error('Version processing failed');

            versionProcessor.process.mockImplementation(() => {
                throw error;
            });

            const route = createRoute(['1']);

            await expect(httpEngine.versionMapping([route], context)).rejects.toThrow(error);

            expect(route.handler).not.toHaveBeenCalled();
        });

        it('should propagate an error when the selected route handler fails', async () => {
            const context = createContext();
            const error = new Error('Route execution failed');

            versionProcessor.process.mockImplementation((definition) => {
                definition?.setVersion('1');
            });

            const route = createRoute(['1'], jest.fn().mockRejectedValue(error));

            await expect(httpEngine.versionMapping([route], context)).rejects.toThrow(error);

            expect(route.handler).toHaveBeenCalledWith(context);
        });
    });

    it('should implement Executable', () => {
        expect(httpEngine).toBeInstanceOf(HttpEngine);

        const executable: Executable = httpEngine;

        expect(executable.execute).toBeInstanceOf(Function);
    });
});
