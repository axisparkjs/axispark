import { Controller } from './controller';
import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { Constructable } from '@axisparkjs/di';

jest.mock('@axisparkjs/common', () => {
    const originalModule = jest.requireActual('@axisparkjs/common');
    return {
        ...originalModule,
        Metadata: {
            define: jest.fn()
        }
    }
});

jest.mock('@axisparkjs/di', () => ({
    Constructable: jest.fn()
}));

describe('Controller decorator', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should mark the class as injectable', () => {
        const injectableDecorator = jest.fn();

        (Constructable as jest.Mock).mockReturnValue(injectableDecorator);

        @Controller()
        class TestController {}

        expect(Constructable).toHaveBeenCalledWith(MetadataKeys.INJECTABLE);
        expect(injectableDecorator).toHaveBeenCalledWith(TestController);
    });

    it('should define controller metadata with the default prefix', () => {
        const injectableDecorator = jest.fn();

        (Constructable as jest.Mock).mockReturnValue(injectableDecorator);

        @Controller()
        class TestController {}

        expect(Metadata.define).toHaveBeenCalledWith(
            MetadataKeys.CONTROLLER,
            { prefix: '' },
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
            { prefix: '/users' },
            TestController
        );
    });
});