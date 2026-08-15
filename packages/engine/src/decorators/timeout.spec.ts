import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { Timeout, NoTimeout } from './timeout';

jest.mock('@axisparkjs/common', () => ({
    Metadata: {
        normalizeTarget: jest.fn((target) => target),
        define: jest.fn()
    },
    MetadataKeys: {
        TIMEOUT: 'TIMEOUT'
    }
}));

describe('Timeout', () => {
    describe('when used as a method decorator', () => {
        it('should define the execution timeout on the method', () => {
            const target = {
                prototype: {}
            };
            const propertyKey = 'testMethod';
            const timeout = 5000;
            const metadata = {
                target,
                propertyKey,
                time: timeout
            };

            const defineSpy = jest.spyOn(Metadata, 'define');

            Timeout(timeout)(target, propertyKey, {});

            expect(defineSpy).toHaveBeenCalledWith(MetadataKeys.TIMEOUT, metadata, target, propertyKey);

            defineSpy.mockRestore();
        });
    });

    describe('when used as a class decorator', () => {
        it('should define the execution timeout on the class', () => {
            class TestClass {}

            const timeout = 5000;
            const metadata = {
                target: TestClass,
                time: timeout
            };
            const defineSpy = jest.spyOn(Metadata, 'define');

            Timeout(timeout)(TestClass);

            expect(defineSpy).toHaveBeenCalledWith(MetadataKeys.TIMEOUT, metadata, TestClass);

            defineSpy.mockRestore();
        });
    });
});

describe('NoTimeout', () => {
    it('should define -1 as the execution timeout', () => {
        const target = {};
        const propertyKey = 'testMethod';
        const defineSpy = jest.spyOn(Metadata, 'define');

        const metadata = {
            target: {},
            propertyKey,
            time: -1
        };

        NoTimeout()(target, propertyKey, {});

        expect(defineSpy).toHaveBeenCalledWith(MetadataKeys.TIMEOUT, metadata, target, propertyKey);

        defineSpy.mockRestore();
    });
});
