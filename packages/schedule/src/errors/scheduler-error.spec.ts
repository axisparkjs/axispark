import { SchedulerError } from './scheduler-error';

describe('SchedulerError', () => {
    it('should create a SchedulerError with the expected properties', () => {
        const error = new SchedulerError('Scheduler failed');

        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(SchedulerError);
        expect(error.message).toBe('Scheduler failed');
        expect(error.name).toBe('SchedulerError');
    });
});
