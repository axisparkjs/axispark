import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { Timeout, NoTimeout } from './timeout';

describe('Timeout', () => {
    describe('when used as a method decorator', () => {
        it('should define the execution timeout on the method', () => {
            const target = {};
            const propertyKey = 'testMethod';
            const timeout = 5000;

            const defineSpy = jest.spyOn(Metadata, 'define');

            Timeout(timeout)(target, propertyKey, {});

            expect(defineSpy).toHaveBeenCalledWith(
                MetadataKeys.EXECUTION_TIMEOUT,
                timeout,
                target,
                propertyKey,
            );

            defineSpy.mockRestore();
        });
    });

    describe('when used as a class decorator', () => {
        it('should define the execution timeout on the class', () => {
            class TestClass {}

            const timeout = 5000;
            const defineSpy = jest.spyOn(Metadata, 'define');

            Timeout(timeout)(TestClass);

            expect(defineSpy).toHaveBeenCalledWith(
                MetadataKeys.EXECUTION_TIMEOUT,
                timeout,
                TestClass,
            );

            defineSpy.mockRestore();
        });
    });
});

describe('NoTimeout', () => {
    it('should define -1 as the execution timeout', () => {
        const target = {};
        const propertyKey = 'testMethod';

        const defineSpy = jest.spyOn(Metadata, 'define');

        NoTimeout()(target, propertyKey, {});

        expect(defineSpy).toHaveBeenCalledWith(
            MetadataKeys.EXECUTION_TIMEOUT,
            -1,
            target,
            propertyKey,
        );

        defineSpy.mockRestore();
    });
});