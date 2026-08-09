import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { ExecutionContext } from '../execution/execution-context';
import { ExecutionHandler } from '../execution/execution-handler';
import { ExecutionTimeoutProcessor } from './execution-timeout-processor';

describe('ExecutionTimeoutProcessor', () => {
    let context: ExecutionContext;
    let handler: ExecutionHandler;
    let processor: ExecutionTimeoutProcessor;
    let getSpy: jest.SpyInstance;

    beforeEach(() => {
        context = {} as ExecutionContext;

        handler = {
            target: class TestTarget {},
            method: 'testMethod'
        } as ExecutionHandler;

        getSpy = jest.spyOn(Metadata, 'get');

        processor = new (class extends ExecutionTimeoutProcessor {
            process(): Promise<unknown> {
                return Promise.resolve();
            }
        })(context, handler);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('time', () => {
        it('should return the method metadata when it is defined', () => {
            getSpy
                .mockReturnValueOnce(1000) // class metadata
                .mockReturnValueOnce(2000); // method metadata

            expect(processor.time).toBe(2000);

            expect(getSpy).toHaveBeenNthCalledWith(1, MetadataKeys.EXECUTION_TIMEOUT, handler.target);

            expect(getSpy).toHaveBeenNthCalledWith(2, MetadataKeys.EXECUTION_TIMEOUT, handler.target, handler.method);
        });

        it('should return the class metadata when method metadata is not defined', () => {
            getSpy
                .mockReturnValueOnce(3000) // class metadata
                .mockReturnValueOnce(undefined); // method metadata

            expect(processor.time).toBe(3000);
        });

        it('should return the baseTime when no metadata is defined', () => {
            getSpy.mockReturnValueOnce(undefined).mockReturnValueOnce(undefined);

            processor = new (class extends ExecutionTimeoutProcessor {
                process(): Promise<unknown> {
                    return Promise.resolve();
                }
            })(context, handler, 4000);

            expect(processor.time).toBe(4000);
        });

        it('should return 5000 when no metadata or baseTime is defined', () => {
            getSpy.mockReturnValueOnce(undefined).mockReturnValueOnce(undefined);

            expect(processor.time).toBe(5000);
        });

        it('should use method metadata over class metadata and baseTime', () => {
            getSpy.mockReturnValueOnce(1000).mockReturnValueOnce(2000);

            processor = new (class extends ExecutionTimeoutProcessor {
                process(): Promise<unknown> {
                    return Promise.resolve();
                }
            })(context, handler, 3000);

            expect(processor.time).toBe(2000);
        });

        it('should use class metadata over baseTime', () => {
            getSpy.mockReturnValueOnce(1000).mockReturnValueOnce(undefined);

            processor = new (class extends ExecutionTimeoutProcessor {
                process(): Promise<unknown> {
                    return Promise.resolve();
                }
            })(context, handler, 3000);

            expect(processor.time).toBe(1000);
        });

        it('should support a baseTime of 0', () => {
            getSpy.mockReturnValueOnce(undefined).mockReturnValueOnce(undefined);

            processor = new (class extends ExecutionTimeoutProcessor {
                process(): Promise<unknown> {
                    return Promise.resolve();
                }
            })(context, handler, 0);

            expect(processor.time).toBe(0);
        });
    });

    describe('process', () => {
        it('should be implemented by subclasses', async () => {
            const result = await processor.process();

            expect(result).toBeUndefined();
        });
    });
});
