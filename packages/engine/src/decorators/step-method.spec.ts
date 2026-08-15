import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { StepType, StepScope } from '../step';
import { After, Before, Catch, Check, Handle } from './step-method';

jest.mock('@axisparkjs/common', () => ({
    Metadata: {
        get: jest.fn(),
        define: jest.fn(),
        normalizeTarget: jest.fn((target) => target)
    },
    MetadataKeys: {
        STEP_METHOD: 'STEP_METHOD'
    }
}));

class TestError extends Error {}

class AnotherError extends Error {}

describe('StepMethod decorators', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (Metadata.normalizeTarget as jest.Mock).mockImplementation((target) => target);
    });

    describe('@Handle', () => {
        it('should define middleware metadata', () => {
            (Metadata.get as jest.Mock).mockReturnValue(undefined);

            class Controller {
                @Handle()
                execute() {}
            }

            expect(Metadata.get).toHaveBeenCalledWith(MetadataKeys.STEP_METHOD, Controller.prototype);

            expect(Metadata.normalizeTarget).toHaveBeenCalledWith(Controller.prototype);

            expect(Metadata.define).toHaveBeenCalledWith(
                MetadataKeys.STEP_METHOD,
                [
                    {
                        target: Controller.prototype,
                        propertyKey: 'execute',
                        type: StepType.Middleware
                    }
                ],
                Controller.prototype
            );
        });

        it('should append middleware metadata', () => {
            class Controller {
                execute() {}
            }

            const existingMetadata = [
                {
                    target: Controller.prototype,
                    propertyKey: 'before',
                    type: StepType.Middleware
                }
            ];

            (Metadata.get as jest.Mock).mockReturnValue(existingMetadata);

            const decorator = Handle();

            decorator(Controller.prototype, 'execute', Object.getOwnPropertyDescriptor(Controller.prototype, 'execute') as PropertyDescriptor);

            expect(Metadata.define).toHaveBeenCalledWith(
                MetadataKeys.STEP_METHOD,
                [
                    existingMetadata[0],
                    {
                        target: Controller.prototype,
                        propertyKey: 'execute',
                        type: StepType.Middleware
                    }
                ],
                Controller.prototype
            );
        });
    });

    describe('@Check', () => {
        it('should define guard metadata', () => {
            (Metadata.get as jest.Mock).mockReturnValue(undefined);

            class Controller {
                @Check()
                check() {}
            }

            expect(Metadata.define).toHaveBeenCalledWith(
                MetadataKeys.STEP_METHOD,
                [
                    {
                        target: Controller.prototype,
                        propertyKey: 'check',
                        type: StepType.Guard
                    }
                ],
                Controller.prototype
            );
        });
    });

    describe('@Before', () => {
        it('should define before interceptor metadata', () => {
            (Metadata.get as jest.Mock).mockReturnValue(undefined);

            class Controller {
                @Before()
                intercept() {}
            }

            expect(Metadata.define).toHaveBeenCalledWith(
                MetadataKeys.STEP_METHOD,
                [
                    {
                        target: Controller.prototype,
                        propertyKey: 'intercept',
                        type: StepType.Interceptor,
                        scope: StepScope.Before
                    }
                ],
                Controller.prototype
            );
        });
    });

    describe('@After', () => {
        it('should define after interceptor metadata', () => {
            (Metadata.get as jest.Mock).mockReturnValue(undefined);

            class Controller {
                @After()
                intercept() {}
            }

            expect(Metadata.define).toHaveBeenCalledWith(
                MetadataKeys.STEP_METHOD,
                [
                    {
                        target: Controller.prototype,
                        propertyKey: 'intercept',
                        type: StepType.Interceptor,
                        scope: StepScope.After
                    }
                ],
                Controller.prototype
            );
        });
    });

    describe('@Catch', () => {
        it('should define filter metadata with accepted errors', () => {
            (Metadata.get as jest.Mock).mockReturnValue(undefined);

            class Controller {
                @Catch(TestError, AnotherError)
                handleError() {}
            }

            expect(Metadata.define).toHaveBeenCalledWith(
                MetadataKeys.STEP_METHOD,
                [
                    {
                        target: Controller.prototype,
                        propertyKey: 'handleError',
                        type: StepType.Filter,
                        acceptedErrors: [TestError, AnotherError]
                    }
                ],
                Controller.prototype
            );
        });

        it('should support Catch without accepted errors', () => {
            (Metadata.get as jest.Mock).mockReturnValue(undefined);

            class Controller {
                @Catch()
                handleError() {}
            }

            expect(Metadata.define).toHaveBeenCalledWith(
                MetadataKeys.STEP_METHOD,
                [
                    {
                        target: Controller.prototype,
                        propertyKey: 'handleError',
                        type: StepType.Filter,
                        acceptedErrors: []
                    }
                ],
                Controller.prototype
            );
        });
    });

    describe('metadata', () => {
        it('should append metadata returned by Metadata.get', () => {
            class Controller {
                @Handle()
                first() {}
            }

            const existingMetadata = [
                {
                    target: Controller.prototype,
                    propertyKey: 'existing',
                    type: StepType.Guard
                }
            ];

            (Metadata.get as jest.Mock).mockReturnValue(existingMetadata);

            class SecondController {
                @Handle()
                execute() {}
            }

            expect(Metadata.define).toHaveBeenCalledWith(
                MetadataKeys.STEP_METHOD,
                [
                    existingMetadata[0],
                    {
                        target: SecondController.prototype,
                        propertyKey: 'execute',
                        type: StepType.Middleware
                    }
                ],
                SecondController.prototype
            );
        });

        it('should use an empty array when no metadata exists', () => {
            (Metadata.get as jest.Mock).mockReturnValue(undefined);

            class Controller {
                @Check()
                execute() {}
            }

            expect(Metadata.define).toHaveBeenCalledWith(
                MetadataKeys.STEP_METHOD,
                [
                    {
                        target: Controller.prototype,
                        propertyKey: 'execute',
                        type: StepType.Guard
                    }
                ],
                Controller.prototype
            );
        });

        it('should normalize the target', () => {
            const normalizedTarget = class NormalizedTarget {};

            (Metadata.normalizeTarget as jest.Mock).mockReturnValue(normalizedTarget);

            class Controller {
                execute() {}
            }

            Handle()(Controller.prototype, 'execute', Object.getOwnPropertyDescriptor(Controller.prototype, 'execute') as PropertyDescriptor);

            expect(Metadata.normalizeTarget).toHaveBeenCalledWith(Controller.prototype);

            expect(Metadata.define).toHaveBeenCalledWith(
                MetadataKeys.STEP_METHOD,
                [
                    {
                        target: normalizedTarget,
                        propertyKey: 'execute',
                        type: StepType.Middleware
                    }
                ],
                Controller.prototype
            );
        });
    });

    describe('all decorators', () => {
        it('should generate the correct metadata for each decorator', () => {
            (Metadata.get as jest.Mock).mockReturnValue(undefined);

            class Controller {
                @Handle()
                handle() {}

                @Check()
                check() {}

                @Before()
                before() {}

                @After()
                after() {}

                @Catch(TestError)
                catch() {}
            }

            expect(Metadata.define).toHaveBeenNthCalledWith(
                1,
                MetadataKeys.STEP_METHOD,
                [
                    {
                        target: Controller.prototype,
                        propertyKey: 'handle',
                        type: StepType.Middleware
                    }
                ],
                Controller.prototype
            );

            expect(Metadata.define).toHaveBeenNthCalledWith(
                2,
                MetadataKeys.STEP_METHOD,
                [
                    {
                        target: Controller.prototype,
                        propertyKey: 'check',
                        type: StepType.Guard
                    }
                ],
                Controller.prototype
            );

            expect(Metadata.define).toHaveBeenNthCalledWith(
                3,
                MetadataKeys.STEP_METHOD,
                [
                    {
                        target: Controller.prototype,
                        propertyKey: 'before',
                        type: StepType.Interceptor,
                        scope: StepScope.Before
                    }
                ],
                Controller.prototype
            );

            expect(Metadata.define).toHaveBeenNthCalledWith(
                4,
                MetadataKeys.STEP_METHOD,
                [
                    {
                        target: Controller.prototype,
                        propertyKey: 'after',
                        type: StepType.Interceptor,
                        scope: StepScope.After
                    }
                ],
                Controller.prototype
            );

            expect(Metadata.define).toHaveBeenNthCalledWith(
                5,
                MetadataKeys.STEP_METHOD,
                [
                    {
                        target: Controller.prototype,
                        propertyKey: 'catch',
                        type: StepType.Filter,
                        acceptedErrors: [TestError]
                    }
                ],
                Controller.prototype
            );
        });
    });
});
