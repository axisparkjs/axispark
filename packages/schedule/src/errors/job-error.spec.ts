import { JobError } from './job-error';

describe('JobError', () => {
    it('should extend Error', () => {
        const error = new JobError('Something went wrong');

        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(JobError);
    });

    it('should set the message', () => {
        const error = new JobError('Something went wrong');

        expect(error.message).toBe('Something went wrong');
    });

    it('should set the name', () => {
        const error = new JobError('Something went wrong');

        expect(error.name).toBe('JobError');
    });
});
