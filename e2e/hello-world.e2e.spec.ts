import { AxiSparkTestFactory, AxiSparkTestCore } from '@axisparkjs/test';
import { Logger } from '@axisparkjs/logger';
import { app } from '@axisparkjs/samples/hello-world/src/app';
import { HelloWorldPlugin, registerText, startText, stopText } from '@axisparkjs/samples/hello-world/src/plugin';
import { HelloWorldServie } from '@axisparkjs/samples/hello-world/src/service';

describe('Hello World App', () => {
    let axiSparkCore: AxiSparkTestCore;
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
        axiSparkCore = AxiSparkTestFactory.create({
            app,
            providers: [{ token: Logger, useValue: mockLogger }]
        });
    });

    it('should create an instance of AxiSparkTestCore', () => {
        expect(axiSparkCore).toBeInstanceOf(AxiSparkTestCore);
    });

    it('should create the app with Hello World plugin', async () => {
        const plugins = axiSparkCore.used();
        expect(plugins).toHaveLength(1);
        expect(plugins).toStrictEqual([{ type: HelloWorldPlugin, options: undefined }]);
    });

    it('should log the correct messages on plugin lifecycle events', async () => {
        await axiSparkCore.init();
        expect(mockLogger.info).toHaveBeenCalledWith(registerText);

        await axiSparkCore.run();
        expect(mockLogger.info).toHaveBeenCalledWith(startText);

        await axiSparkCore.destroy();
        expect(mockLogger.info).toHaveBeenCalledWith(stopText);
    });
});
