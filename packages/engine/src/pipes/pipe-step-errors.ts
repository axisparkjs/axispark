import { PipeStepExecutionContext } from './pipe-step-execution-context';

export class PipeStepError extends Error {
    constructor(
        public readonly data: PipeStepExecutionContext,
        message: string
    ) {
        super(message);
        this.name = 'PipeStepError';
    }
}

export class PipeStepParsingError extends PipeStepError {
    constructor(data: PipeStepExecutionContext, message: string, type: string) {
        super(data, `Parsing failed for '${String(data.parameter)}' as ${type}: ${message}`);
        this.name = 'PipeStepParsingError';
    }
}

export class PipeStepValidationError extends PipeStepError {
    constructor(data: PipeStepExecutionContext, message: string) {
        super(data, `Validation failed for '${String(data.parameter)}': ${message}`);
        this.name = 'PipeStepValidationError';
    }
}
