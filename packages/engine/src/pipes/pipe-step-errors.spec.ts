import {
    PipeStepError,
    PipeStepParsingError,
    PipeStepValidationError,
} from './pipe-step-errors';

describe('Pipe Step Errors', () => {
    const data: any = {
        parameter: 'id',
    };

    describe('PipeStepError', () => {
        it('should create a PipeStepError', () => {
            const error = new PipeStepError(data, 'Something went wrong');

            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(PipeStepError);
            expect(error.name).toBe('PipeStepError');
            expect(error.message).toBe('Something went wrong');
            expect(error.data).toBe(data);
        });
    });

    describe('PipeStepParsingError', () => {
        it('should create a parsing error', () => {
            const error = new PipeStepParsingError(
                data,
                'Invalid number',
                'number',
            );

            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(PipeStepError);
            expect(error).toBeInstanceOf(PipeStepParsingError);

            expect(error.name).toBe('PipeStepParsingError');
            expect(error.data).toBe(data);
            expect(error.message).toBe(
                "Parsing failed for 'id' as number: Invalid number",
            );
        });

        it('should stringify non-string parameters', () => {
            const error = new PipeStepParsingError(
                {
                    parameter: Symbol('value'),
                } as any,
                'Invalid value',
                'uuid',
            );

            expect(error.message).toBe(
                "Parsing failed for 'Symbol(value)' as uuid: Invalid value",
            );
        });
    });

    describe('PipeStepValidationError', () => {
        it('should create a validation error', () => {
            const error = new PipeStepValidationError(
                data,
                'Must not be empty',
            );

            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(PipeStepError);
            expect(error).toBeInstanceOf(PipeStepValidationError);

            expect(error.name).toBe('PipeStepValidationError');
            expect(error.data).toBe(data);
            expect(error.message).toBe(
                "Validation failed for 'id': Must not be empty",
            );
        });

        it('should stringify non-string parameters', () => {
            const error = new PipeStepValidationError(
                {
                    parameter: 123,
                } as any,
                'Invalid value',
            );

            expect(error.message).toBe(
                "Validation failed for '123': Invalid value",
            );
        });
    });
});