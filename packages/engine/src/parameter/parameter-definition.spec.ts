import { ParameterMetadata } from '../metadata';
import { ParameterDefinition } from './parameter-definition';

describe('ParameterDefinition', () => {
    class Target {}

    const metadata: ParameterMetadata = {
        target: Target,
        propertyKey: 'execute',
        parameterIndex: 0,
        parameter: 'value',
        field: 'id'
    };

    describe('fromMetadata', () => {
        it('should create a Parameter from metadata', () => {
            const parameter = ParameterDefinition.fromMetadata(metadata);

            expect(parameter).toBeInstanceOf(ParameterDefinition);
            expect(parameter.target).toBe(Target);
            expect(parameter.propertyKey).toBe('execute');
            expect(parameter.parameterIndex).toBe(0);
            expect(parameter.parameter).toBe('value');
            expect(parameter.field).toBe('id');
        });

        it('should support a symbol property key', () => {
            const propertyKey = Symbol('execute');

            const parameter = ParameterDefinition.fromMetadata({
                ...metadata,
                propertyKey
            });

            expect(parameter.propertyKey).toBe(propertyKey);
        });

        it('should support an undefined field', () => {
            const parameter = ParameterDefinition.fromMetadata({
                ...metadata,
                field: undefined
            });

            expect(parameter.field).toBeUndefined();
        });
    });

    describe('value', () => {
        it('should be undefined initially', () => {
            const parameter = ParameterDefinition.fromMetadata(metadata);

            expect(parameter.value).toBeUndefined();
        });

        it('should return the actual value after setting it', () => {
            const parameter = ParameterDefinition.fromMetadata(metadata);

            parameter.setValue('test');

            expect(parameter.value).toBe('test');
        });

        it('should return the latest actual value', () => {
            const parameter = ParameterDefinition.fromMetadata(metadata);

            parameter.setValue('first');
            parameter.setValue('second');

            expect(parameter.value).toBe('second');
        });
    });

    describe('setValue', () => {
        it('should set the original value on the first assignment', () => {
            const parameter = ParameterDefinition.fromMetadata(metadata);

            parameter.setValue('original');

            expect(parameter.originalValue).toBe('original');
            expect(parameter.value).toBe('original');
        });

        it('should not change the original value on subsequent assignments', () => {
            const parameter = ParameterDefinition.fromMetadata(metadata);

            parameter.setValue('original');
            parameter.setValue('updated');

            expect(parameter.originalValue).toBe('original');
            expect(parameter.value).toBe('updated');
        });

        it('should update the actual value on every assignment', () => {
            const parameter = ParameterDefinition.fromMetadata(metadata);

            parameter.setValue('first');
            expect(parameter.value).toBe('first');

            parameter.setValue('second');
            expect(parameter.value).toBe('second');

            parameter.setValue('third');
            expect(parameter.value).toBe('third');
        });

        it('should preserve the same object as original value', () => {
            const parameter = ParameterDefinition.fromMetadata(metadata);
            const value = { id: 1 };

            parameter.setValue(value);

            expect(parameter.originalValue).toBe(value);
            expect(parameter.value).toBe(value);
        });

        it('should preserve the same object when the value is updated', () => {
            const parameter = ParameterDefinition.fromMetadata(metadata);
            const originalValue = { id: 1 };
            const newValue = { id: 2 };

            parameter.setValue(originalValue);
            parameter.setValue(newValue);

            expect(parameter.originalValue).toBe(originalValue);
            expect(parameter.value).toBe(newValue);
        });
    });
});
