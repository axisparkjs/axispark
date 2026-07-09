import { AxisparkTestFactory, AxisparkTestCore } from '@axisparkjs/test';
import { Logger } from '@axisparkjs/logger';
import { app } from '@axisparkjs/samples/hello-world/src/app';
import { HelloWorldPlugin, registerText, startText, stopText } from '@axisparkjs/samples/hello-world/src/plugin';

describe('Hello World App', () => {
    let axisparkCore: AxisparkTestCore;
    const mockLogger = {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
        trace: jest.fn(),
        fatal: jest.fn(),
        child: jest.fn(),
        log: jest.fn()
    } as unknown as jest.Mocked<Logger>;

    beforeAll(async () => {
        axisparkCore = AxisparkTestFactory.create({
            app,
            providers: [{ token: Logger, useValue: mockLogger }]
        });
    });

    it('should create an instance of AxisparkTestCore', () => {
        expect(axisparkCore).toBeInstanceOf(AxisparkTestCore);
    });

    it('should create the app with Hello World plugin', async () => {
        const plugins = axisparkCore.used();
        expect(plugins).toHaveLength(1);
        expect(plugins).toStrictEqual([{ type: HelloWorldPlugin, options: undefined }]);
    });

    it('should log the correct messages on plugin lifecycle events', async () => {
        await axisparkCore.init();
        expect(mockLogger.info).toHaveBeenCalledWith(registerText);

        await axisparkCore.run();
        expect(mockLogger.info).toHaveBeenCalledWith(startText);

        await axisparkCore.destroy();
        expect(mockLogger.info).toHaveBeenCalledWith(stopText);
    });
});
