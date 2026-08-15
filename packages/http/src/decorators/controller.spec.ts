import { Controller } from './controller';
import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { Constructable } from '@axisparkjs/di';

jest.mock('@axisparkjs/common', () => {
    const originalModule = jest.requireActual('@axisparkjs/common');

    return {
        ...originalModule,
        Metadata: {
            ...originalModule.Metadata,
            define: jest.fn(),
            normalizeTarget: jest.fn()
        }
    };
});

jest.mock('@axisparkjs/di', () => ({
    Constructable: jest.fn()
}));

describe('Controller decorator', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (Metadata.normalizeTarget as jest.Mock).mockImplementation(
            (target) => target
        );
    });

    it('should mark the class as injectable', () => {
        const injectableDecorator = jest.fn();

        (Constructable as jest.Mock).mockReturnValue(injectableDecorator);

        @Controller()
        class TestController {}

        expect(Constructable).toHaveBeenCalledWith(MetadataKeys.INJECTABLE);
        expect(injectableDecorator).toHaveBeenCalledWith(TestController);
    });

    it('should normalize the target', () => {
        const normalizedTarget = {};
        (Metadata.normalizeTarget as jest.Mock).mockReturnValue(normalizedTarget);

        const injectableDecorator = jest.fn();
        (Constructable as jest.Mock).mockReturnValue(injectableDecorator);

        @Controller()
        class TestController {}

        expect(Metadata.normalizeTarget).toHaveBeenCalledWith(TestController);
    });

    it('should define controller metadata with the default prefix', () => {
        const injectableDecorator = jest.fn();

        (Constructable as jest.Mock).mockReturnValue(injectableDecorator);

        @Controller()
        class TestController {}

        expect(Metadata.define).toHaveBeenCalledWith(
            MetadataKeys.CONTROLLER,
            {
                target: TestController,
                prefix: '',
                version: undefined
            },
            TestController
        );
    });

    it('should define controller metadata with the provided prefix', () => {
        const injectableDecorator = jest.fn();

        (Constructable as jest.Mock).mockReturnValue(injectableDecorator);

        @Controller('/users')
        class TestController {}

        expect(Metadata.define).toHaveBeenCalledWith(
            MetadataKeys.CONTROLLER,
            {
                target: TestController,
                prefix: '/users',
                version: undefined
            },
            TestController
        );
    });

    it('should define controller metadata with prefix and version', () => {
        const injectableDecorator = jest.fn();

        (Constructable as jest.Mock).mockReturnValue(injectableDecorator);

        @Controller({
            prefix: '/users',
            version: '1',
        })
        class TestController {}

        expect(Metadata.define).toHaveBeenCalledWith(
            MetadataKeys.CONTROLLER,
            {
                target: TestController,
                prefix: '/users',
                version: '1'
            },
            TestController
        );
    });

    it('should use the normalized target in controller metadata', () => {
        const normalizedTarget = {};
        (Metadata.normalizeTarget as jest.Mock).mockReturnValue(
            normalizedTarget
        );

        const injectableDecorator = jest.fn();
        (Constructable as jest.Mock).mockReturnValue(injectableDecorator);

        @Controller('/users')
        class TestController {}

        expect(Metadata.define).toHaveBeenCalledWith(
            MetadataKeys.CONTROLLER,
            {
                target: normalizedTarget,
                prefix: '/users',
                version: undefined
            },
            TestController
        );
    });
});