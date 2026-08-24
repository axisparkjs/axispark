import { ParameterDefinition } from '../parameter';

/**
 * A base error class for pipe step errors.
 */
export class PipeStepError extends Error {
    constructor(
        public readonly parameter: ParameterDefinition,
        message: string
    ) {
        super(message);
        this.name = 'PipeStepError';
    }
}

/**
 * An error class for pipe step parsing errors.
 */
export class PipeStepParsingError extends PipeStepError {
    constructor(parameter: ParameterDefinition, message: string, type: string) {
        super(parameter, `Parsing failed for '${parameter.parameter}' as ${type}: ${message}`);
        this.name = 'PipeStepParsingError';
    }
}

/**
 * An error class for pipe step validation errors.
 */
export class PipeStepValidationError extends PipeStepError {
    constructor(parameter: ParameterDefinition, message: string) {
        super(parameter, `Validation failed for '${parameter.parameter}': ${message}`);
        this.name = 'PipeStepValidationError';
    }
}
