import { ParameterDefinition } from '../parameter';

export class PipeStepError extends Error {
    constructor(
        public readonly parameter: ParameterDefinition,
        message: string
    ) {
        super(message);
        this.name = 'PipeStepError';
    }
}

export class PipeStepParsingError extends PipeStepError {
    constructor(parameter: ParameterDefinition, message: string, type: string) {
        super(parameter, `Parsing failed for '${parameter.parameter}' as ${type}: ${message}`);
        this.name = 'PipeStepParsingError';
    }
}

export class PipeStepValidationError extends PipeStepError {
    constructor(parameter: ParameterDefinition, message: string) {
        super(parameter, `Validation failed for '${parameter.parameter}': ${message}`);
        this.name = 'PipeStepValidationError';
    }
}
