import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { Pipe } from './pipe';
import { PipeScope } from '../pipe-scope';
import { PipeStep } from '../pipe-step';

jest.mock('@axisparkjs/common', () => ({
    Metadata: {
        get: jest.fn(),
        getMethod: jest.fn(),
        define: jest.fn(),
        defineMethod: jest.fn(),
    },
    MetadataKeys: {
        PIPE: 'PIPE',
    },
}));

class TestPipe implements PipeStep {
    execute(value: any): any {
        return value;
    }
}
class ExistingPipe implements PipeStep {
    execute(value: any): any {
        return value;
    }
}
class NewPipe implements PipeStep {
    execute(value: any): any {
        return value;
    }
}

describe('@Pipe', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('class decorator', () => {
        it('should define pipe metadata on class', () => {
            (Metadata.get as jest.Mock).mockReturnValue(undefined);

            @Pipe(TestPipe)
            class Controller {}

            expect(Metadata.get).toHaveBeenCalledWith(
                MetadataKeys.PIPE,
                Controller,
            );

            expect(Metadata.define).toHaveBeenCalledWith(
                MetadataKeys.PIPE,
                [
                    {
                        scope: PipeScope.Class,
                        steps: [TestPipe],
                    },
                ],
                Controller,
            );
        });

        it('should append metadata if already exists', () => {
            (Metadata.get as jest.Mock).mockReturnValue([
                {
                    scope: PipeScope.Class,
                    steps: [ExistingPipe],
                },
            ]);

            @Pipe(NewPipe)
            class Controller {}

            expect(Metadata.define).toHaveBeenCalledWith(
                MetadataKeys.PIPE,
                [
                    {
                        scope: PipeScope.Class,
                        steps: [ExistingPipe],
                    },
                    {
                        scope: PipeScope.Class,
                        steps: [NewPipe],
                    },
                ],
                Controller,
            );
        });
    });

    describe('method decorator', () => {
        it('should define method metadata', () => {
            (Metadata.getMethod as jest.Mock).mockReturnValue(undefined);

            class Controller {
                @Pipe(TestPipe)
                method() {}
            }

            expect(Metadata.getMethod).toHaveBeenCalledWith(
                MetadataKeys.PIPE,
                Controller.prototype,
                'method',
            );

            expect(Metadata.defineMethod).toHaveBeenCalledWith(
                MetadataKeys.PIPE,
                [
                    {
                        scope: PipeScope.Method,
                        propertyKey: 'method',
                        steps: [TestPipe],
                    },
                ],
                Controller.prototype,
                'method',
            );
        });

        it('should append method metadata', () => {
            (Metadata.getMethod as jest.Mock).mockReturnValue([
                {
                    scope: PipeScope.Method,
                    propertyKey: 'method',
                    steps: [ExistingPipe],
                },
            ]);

            class Controller {
                @Pipe(NewPipe)
                method() {}
            }

            expect(Metadata.defineMethod).toHaveBeenCalledWith(
                MetadataKeys.PIPE,
                [
                    {
                        scope: PipeScope.Method,
                        propertyKey: 'method',
                        steps: [ExistingPipe],
                    },
                    {
                        scope: PipeScope.Method,
                        propertyKey: 'method',
                        steps: [NewPipe],
                    },
                ],
                Controller.prototype,
                'method',
            );
        });
    });

    describe('parameter decorator', () => {
        it('should define parameter metadata', () => {
            (Metadata.getMethod as jest.Mock).mockReturnValue(undefined);

            class Controller {
                method(@Pipe(TestPipe) _value: string) {}
            }

            expect(Metadata.defineMethod).toHaveBeenCalledWith(
                MetadataKeys.PIPE,
                [
                    {
                        scope: PipeScope.Parameter,
                        propertyKey: 'method',
                        index: 0,
                        steps: [TestPipe],
                    },
                ],
                Controller.prototype,
                'method',
            );
        });

        it('should append parameter metadata', () => {
            (Metadata.getMethod as jest.Mock).mockReturnValue([
                {
                    scope: PipeScope.Parameter,
                    propertyKey: 'method',
                    index: 0,
                    steps: [ExistingPipe],
                },
            ]);

            class Controller {
                method(@Pipe(NewPipe) _value: string) {}
            }

            expect(Metadata.defineMethod).toHaveBeenCalledWith(
                MetadataKeys.PIPE,
                [
                    {
                        scope: PipeScope.Parameter,
                        propertyKey: 'method',
                        index: 0,
                        steps: [ExistingPipe],
                    },
                    {
                        scope: PipeScope.Parameter,
                        propertyKey: 'method',
                        index: 0,
                        steps: [NewPipe],
                    },
                ],
                Controller.prototype,
                'method',
            );
        });
    });

    describe('pipe configuration object', () => {
        it('should preserve object steps', () => {
            (Metadata.get as jest.Mock).mockReturnValue(undefined);

            @Pipe({
                pipeStep: TestPipe,
                pipeStepParameters: {
                    value: 'test',
                } as any,
            })
            class Controller {}

            expect(Metadata.define).toHaveBeenCalledWith(
                MetadataKeys.PIPE,
                [
                    {
                        scope: PipeScope.Class,
                        steps: [
                            {
                                pipeStep: TestPipe,
                                pipeStepParameters: {
                                    value: 'test',
                                },
                            },
                        ],
                    },
                ],
                Controller,
            );
        });
    });
});