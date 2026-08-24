import { ClassType } from '@axisparkjs/common';
import { ParameterMetadata } from '../metadata';

/**
 * A definition for a method parameter that includes metadata and value handling.
 */
export class ParameterDefinition {
    public originalValue!: any;
    private actualValue!: any;

    private constructor(
        public readonly target: ClassType,
        public readonly propertyKey: string | symbol,
        public readonly parameterIndex: number,
        public readonly parameter: string,
        public readonly field?: string
    ) {}

    static fromMetadata(metadata: ParameterMetadata): ParameterDefinition {
        const parameter = new ParameterDefinition(metadata.target, metadata.propertyKey, metadata.parameterIndex, metadata.parameter, metadata.field);
        return parameter;
    }

    get value(): any {
        return this.actualValue;
    }

    setValue(value: any): void {
        if (!this.originalValue) this.originalValue = value;
        this.actualValue = value;
    }
}
