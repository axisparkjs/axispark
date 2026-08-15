import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { PipeMetadata } from '../metadata/pipe-metadata';
import { PipeScope, PipeStep } from '../pipe';
import { Pipe } from './pipe';

jest.mock('@axisparkjs/common', () => ({
    Metadata: {
        get: jest.fn(),
        define: jest.fn(),
        normalizeTarget: jest.fn((target) => target)
    },
    MetadataKeys: {
        PIPE: 'PIPE'
    }
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

        (Metadata.normalizeTarget as jest.Mock).mockImplementation((target) => target);
    });

    describe('class decorator', () => {
        it('should define pipe metadata on class', () => {
            (Metadata.get as jest.Mock).mockReturnValue(undefined);

            @Pipe(TestPipe)
            class Controller {}

            expect(Metadata.get).toHaveBeenCalledWith(MetadataKeys.PIPE, Controller);

            expect(Metadata.normalizeTarget).toHaveBeenCalledWith(Controller);

            expect(Metadata.define).toHaveBeenCalledWith(
                MetadataKeys.PIPE,
                [
                    {
                        target: Controller,
                        pipeScope: PipeScope.Class,
                        steps: [TestPipe]
                    }
                ],
                Controller
            );
        });

        it('should append metadata if already exists', () => {
            const existingMetadata: PipeMetadata[] = [
                {
                    target: class ExistingTarget {},
                    pipeScope: PipeScope.Class,
                    steps: [ExistingPipe]
                }
            ];

            (Metadata.get as jest.Mock).mockReturnValue(existingMetadata);

            @Pipe(NewPipe)
            class Controller {}

            expect(Metadata.define).toHaveBeenCalledWith(
                MetadataKeys.PIPE,
                [
                    existingMetadata[0],
                    {
                        target: Controller,
                        pipeScope: PipeScope.Class,
                        steps: [NewPipe]
                    }
                ],
                Controller
            );
        });

        it('should preserve multiple pipe steps', () => {
            (Metadata.get as jest.Mock).mockReturnValue(undefined);

            @Pipe(TestPipe, ExistingPipe, NewPipe)
            class Controller {}

            expect(Metadata.define).toHaveBeenCalledWith(
                MetadataKeys.PIPE,
                [
                    {
                        target: Controller,
                        pipeScope: PipeScope.Class,
                        steps: [TestPipe, ExistingPipe, NewPipe]
                    }
                ],
                Controller
            );
        });
    });

    describe('method decorator', () => {
        it('should define method metadata', () => {
            (Metadata.get as jest.Mock).mockReturnValue(undefined);

            class Controller {
                @Pipe(TestPipe)
                method() {}
            }

            expect(Metadata.get).toHaveBeenCalledWith(MetadataKeys.PIPE, Controller.prototype, 'method');

            expect(Metadata.normalizeTarget).toHaveBeenCalledWith(Controller.prototype);

            expect(Metadata.define).toHaveBeenCalledWith(
                MetadataKeys.PIPE,
                [
                    {
                        target: Controller.prototype,
                        propertyKey: 'method',
                        pipeScope: PipeScope.Method,
                        steps: [TestPipe]
                    }
                ],
                Controller.prototype,
                'method'
            );
        });

        it('should append method metadata', () => {
            const existingMetadata: PipeMetadata[] = [
                {
                    target: 'test' as any,
                    propertyKey: 'method',
                    pipeScope: PipeScope.Method,
                    steps: [ExistingPipe]
                }
            ];

            (Metadata.get as jest.Mock).mockReturnValue(existingMetadata);
            (Metadata.normalizeTarget as jest.Mock).mockReturnValue('test');

            class Controller {
                @Pipe(NewPipe)
                method() {}
            }

            expect(Metadata.define).toHaveBeenCalledWith(
                MetadataKeys.PIPE,
                [
                    existingMetadata[0],
                    {
                        target: 'test' as any,
                        propertyKey: 'method',
                        pipeScope: PipeScope.Method,
                        steps: [NewPipe]
                    }
                ],
                Controller.prototype,
                'method'
            );
        });

        it('should support multiple steps on a method', () => {
            (Metadata.get as jest.Mock).mockReturnValue(undefined);

            class Controller {
                @Pipe(TestPipe, NewPipe)
                method() {}
            }

            expect(Metadata.define).toHaveBeenCalledWith(
                MetadataKeys.PIPE,
                [
                    {
                        target: Controller.prototype,
                        propertyKey: 'method',
                        pipeScope: PipeScope.Method,
                        steps: [TestPipe, NewPipe]
                    }
                ],
                Controller.prototype,
                'method'
            );
        });
    });

    describe('parameter decorator', () => {
        it('should define parameter metadata', () => {
            (Metadata.get as jest.Mock).mockReturnValue(undefined);

            class Controller {
                method(@Pipe(TestPipe) _value: string) {}
            }

            expect(Metadata.get).toHaveBeenCalledWith(MetadataKeys.PIPE, Controller.prototype, 'method');

            expect(Metadata.normalizeTarget).toHaveBeenCalledWith(Controller.prototype);

            expect(Metadata.define).toHaveBeenCalledWith(
                MetadataKeys.PIPE,
                [
                    {
                        target: Controller.prototype,
                        propertyKey: 'method',
                        parameterIndex: 0,
                        pipeScope: PipeScope.Parameter,
                        steps: [TestPipe]
                    }
                ],
                Controller.prototype,
                'method'
            );
        });

        it('should append parameter metadata', () => {
            const existingMetadata: PipeMetadata[] = [
                {
                    target: 'test' as any,
                    propertyKey: 'method',
                    parameterIndex: 0,
                    pipeScope: PipeScope.Parameter,
                    steps: [ExistingPipe]
                }
            ];

            (Metadata.get as jest.Mock).mockReturnValue(existingMetadata);
            (Metadata.normalizeTarget as jest.Mock).mockReturnValue('test');

            class Controller {
                method(@Pipe(NewPipe) _value: string) {}
            }

            expect(Metadata.define).toHaveBeenCalledWith(
                MetadataKeys.PIPE,
                [
                    existingMetadata[0],
                    {
                        target: 'test' as any,
                        propertyKey: 'method',
                        parameterIndex: 0,
                        pipeScope: PipeScope.Parameter,
                        steps: [NewPipe]
                    }
                ],
                Controller.prototype,
                'method'
            );
        });

        it('should use the correct parameter index', () => {
            (Metadata.get as jest.Mock).mockReturnValue(undefined);

            class Controller {
                method(_first: string, @Pipe(TestPipe) _second: string) {}
            }

            expect(Metadata.define).toHaveBeenCalledWith(
                MetadataKeys.PIPE,
                [
                    {
                        target: Controller.prototype,
                        propertyKey: 'method',
                        parameterIndex: 1,
                        pipeScope: PipeScope.Parameter,
                        steps: [TestPipe]
                    }
                ],
                Controller.prototype,
                'method'
            );
        });

        it('should preserve multiple steps for a parameter', () => {
            (Metadata.get as jest.Mock).mockReturnValue(undefined);

            class Controller {
                method(@Pipe(TestPipe, NewPipe) _value: string) {}
            }

            expect(Metadata.define).toHaveBeenCalledWith(
                MetadataKeys.PIPE,
                [
                    {
                        target: Controller.prototype,
                        propertyKey: 'method',
                        parameterIndex: 0,
                        pipeScope: PipeScope.Parameter,
                        steps: [TestPipe, NewPipe]
                    }
                ],
                Controller.prototype,
                'method'
            );
        });
    });

    describe('pipe configuration object', () => {
        it('should preserve object steps', () => {
            (Metadata.get as jest.Mock).mockReturnValue(undefined);

            const config = {
                value: 'test'
            };

            @Pipe({
                pipeStep: TestPipe,
                PipeStepConfig: config
            })
            class Controller {}

            expect(Metadata.define).toHaveBeenCalledWith(
                MetadataKeys.PIPE,
                [
                    {
                        target: Controller,
                        pipeScope: PipeScope.Class,
                        steps: [
                            {
                                pipeStep: TestPipe,
                                PipeStepConfig: config
                            }
                        ]
                    }
                ],
                Controller
            );
        });

        it('should preserve multiple configured steps', () => {
            (Metadata.get as jest.Mock).mockReturnValue(undefined);

            const firstConfig = {
                value: 'first'
            };

            const secondConfig = {
                value: 'second'
            };

            @Pipe(
                {
                    pipeStep: TestPipe,
                    PipeStepConfig: firstConfig
                },
                {
                    pipeStep: NewPipe,
                    PipeStepConfig: secondConfig
                }
            )
            class Controller {}

            expect(Metadata.define).toHaveBeenCalledWith(
                MetadataKeys.PIPE,
                [
                    {
                        target: Controller,
                        pipeScope: PipeScope.Class,
                        steps: [
                            {
                                pipeStep: TestPipe,
                                PipeStepConfig: firstConfig
                            },
                            {
                                pipeStep: NewPipe,
                                PipeStepConfig: secondConfig
                            }
                        ]
                    }
                ],
                Controller
            );
        });
    });

    describe('metadata lookup', () => {
        it('should use existing metadata returned by Metadata.get', () => {
            const existingMetadata: PipeMetadata[] = [
                {
                    target: class ExistingTarget {},
                    pipeScope: PipeScope.Class,
                    steps: [ExistingPipe]
                }
            ];

            (Metadata.get as jest.Mock).mockReturnValue(existingMetadata);

            @Pipe(NewPipe)
            class Controller {}

            expect(Metadata.get).toHaveBeenCalledTimes(1);

            expect(Metadata.define).toHaveBeenCalledWith(
                MetadataKeys.PIPE,
                expect.arrayContaining([
                    existingMetadata[0],
                    expect.objectContaining({
                        target: Controller,
                        pipeScope: PipeScope.Class,
                        steps: [NewPipe]
                    })
                ]),
                Controller
            );
        });
    });
});
