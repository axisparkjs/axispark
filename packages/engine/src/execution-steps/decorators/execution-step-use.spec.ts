import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { Use } from './execution-step-use';

jest.mock('@axisparkjs/common', () => ({
    Metadata: {
        define: jest.fn()
    },
    MetadataKeys: {
        EXECUTION_STEP_USE: 'EXECUTION_STEP_USE'
    }
}));

describe('@Use', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('class decorator', () => {
        it('should define metadata on the class', () => {
            class Step1 {}
            class Step2 {}

            @Use(Step1, Step2)
            class Controller {}

            expect(Metadata.define).toHaveBeenCalledTimes(1);
            expect(Metadata.define).toHaveBeenCalledWith(
                MetadataKeys.EXECUTION_STEP_USE,
                {
                    targets: [Step1, Step2]
                },
                Controller
            );
        });
    });

    describe('method decorator', () => {
        it('should define metadata on the method', () => {
            class Step1 {}
            class Step2 {}

            class Controller {
                @Use(Step1, Step2)
                execute() {}
            }

            expect(Metadata.define).toHaveBeenCalledTimes(1);
            expect(Metadata.define).toHaveBeenCalledWith(
                MetadataKeys.EXECUTION_STEP_USE,
                {
                    targets: [Step1, Step2]
                },
                Controller.prototype,
                'execute'
            );
        });
    });

    describe('targets', () => {
        it('should support a single target', () => {
            class Step {}

            @Use(Step)
            class Controller {}

            expect(Metadata.define).toHaveBeenCalledWith(
                MetadataKeys.EXECUTION_STEP_USE,
                {
                    targets: [Step]
                },
                Controller
            );
        });

        it('should support no targets', () => {
            @Use()
            class Controller {}

            expect(Metadata.define).toHaveBeenCalledWith(
                MetadataKeys.EXECUTION_STEP_USE,
                {
                    targets: []
                },
                Controller
            );
        });
    });
});
