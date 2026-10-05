import { AxiSparkTestFactory } from '@axisparkjs/test';
import { AxiSparkCore } from '@axisparkjs/core';
import { Logger } from '@axisparkjs/logger';
import { SchedulePlugin } from '@axisparkjs/schedule';
import { app } from '@axisparkjs/samples/scheduling-jobs/src/app';

describe('Scheduling Jobs App', () => {
    let axiSparkCore: AxiSparkCore;
    const mockLogger = {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
        trace: jest.fn(),
        fatal: jest.fn(),
        child: jest.fn().mockReturnThis(),
        log: jest.fn()
    } as unknown as jest.Mocked<Logger>;

    beforeAll(async () => {
        axiSparkCore = AxiSparkTestFactory.create({
            app,
            providers: [{ token: Logger, useValue: mockLogger }]
        });
        await axiSparkCore.init();
        await axiSparkCore.run();
    });

    it('should create an instance of AxiSparkTestCore', () => {
        expect(axiSparkCore).toBeInstanceOf(AxiSparkCore);
    });

    it('should create the app with Schedule Plugin', async () => {
        const plugins = axiSparkCore.used();
        expect(plugins).toHaveLength(1);
        expect(plugins).toStrictEqual([{ type: SchedulePlugin, options: undefined }]);
    });

    it('should register and start the jobs', async () => {
        await new Promise((resolve) => setTimeout(resolve, 6100)); // Wait for 6.1 seconds to allow the jobs to execute

        // Second 1
        expect(mockLogger.trace).toHaveBeenCalledWith('Cron job executed');
        // Second 2
        expect(mockLogger.trace).toHaveBeenCalledWith('Cron job executed');
        expect(mockLogger.trace).toHaveBeenCalledWith('Every 2 seconds job executed');
        expect(mockLogger.trace).toHaveBeenCalledWith('Timeout 2 seconds job executed');
        // Second 3
        expect(mockLogger.trace).toHaveBeenCalledWith('Cron job executed');
        expect(mockLogger.trace).not.toHaveBeenCalledWith('Every 3 seconds interval job executed');
        expect(mockLogger.trace).toHaveBeenCalledWith('Date job executed');
        // Second 4
        expect(mockLogger.trace).toHaveBeenCalledWith('Cron job executed');
        expect(mockLogger.trace).toHaveBeenCalledWith('Every 2 seconds job executed');
        expect(mockLogger.trace).toHaveBeenCalledWith('Every second interval job executed');
        // Second 5
        expect(mockLogger.trace).toHaveBeenCalledWith('Cron job executed');
        expect(mockLogger.trace).not.toHaveBeenCalledWith('Every 5 seconds job executed');
        expect(mockLogger.trace).toHaveBeenCalledWith('Every second interval job executed');
        // Second 6
        expect(mockLogger.trace).toHaveBeenCalledWith('Cron job executed');
        expect(mockLogger.trace).toHaveBeenCalledWith('Every 2 seconds job executed');
        expect(mockLogger.trace).toHaveBeenCalledWith('Timeout 6 seconds job executed');
        expect(mockLogger.trace).toHaveBeenCalledWith('Every second interval job executed');
    }, 7000);

    afterAll(async () => {
        await axiSparkCore.destroy();
    });
});
