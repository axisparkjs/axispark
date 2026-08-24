/**
 * Represents an error that occurs during the execution of a job.
 */
export class JobError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'JobError';
    }
}
