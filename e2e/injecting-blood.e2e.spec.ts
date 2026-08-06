import { AxiSparkTestFactory } from '@axisparkjs/test';
import { AxiSparkCore } from '@axisparkjs/core';
import { Logger } from '@axisparkjs/logger';
import { app } from '@axisparkjs/samples/injecting-blood/src/app';
import { InjectingBlood1Plugin, InjectingBlood2Plugin, InjectingBlood3Plugin } from '@axisparkjs/samples/injecting-blood/src/plugins';

describe('Injecting Blood App', () => {
    let axiSparkCore: AxiSparkCore;
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
        expect(axiSparkCore).toBeInstanceOf(AxiSparkCore);
    });

    it('should create the app with Injecting Blood plugins', async () => {
        const plugins = axiSparkCore.used();
        expect(plugins).toHaveLength(3);
        expect(plugins).toStrictEqual([
            { type: InjectingBlood1Plugin, options: undefined },
            { type: InjectingBlood2Plugin, options: undefined },
            { type: InjectingBlood3Plugin, options: undefined }
        ]);
    });

    it('should log that injections are OK in all plugins', async () => {
        await axiSparkCore.init();

        expect(mockLogger.info).toHaveBeenCalledWith('InjectingBlood1Plugin logger: true');
        expect(mockLogger.info).toHaveBeenCalledWith('InjectingBlood1Plugin dep1: true');
        expect(mockLogger.info).toHaveBeenCalledWith('InjectingBlood1Plugin dep2: true');
        expect(mockLogger.info).toHaveBeenCalledWith('InjectingBlood1Plugin dep3impl: true');
        expect(mockLogger.info).toHaveBeenCalledWith('InjectingBlood1Plugin dep3: true');
        expect(mockLogger.info).toHaveBeenCalledWith('InjectingBlood1Plugin registered');

        expect(mockLogger.info).toHaveBeenCalledWith('InjectingBlood2Plugin logger: true');
        expect(mockLogger.info).toHaveBeenCalledWith('InjectingBlood2Plugin dep2FromPlugin: true');
        expect(mockLogger.info).toHaveBeenCalledWith('InjectingBlood2Plugin registered');

        expect(mockLogger.info).toHaveBeenCalledWith('InjectingBlood3Plugin logger: true');
        expect(mockLogger.info).toHaveBeenCalledWith('InjectingBlood3Plugin dep1FromInjector: true');
        expect(mockLogger.info).toHaveBeenCalledWith('InjectingBlood3Plugin dep3FromInjector: true');
        expect(mockLogger.info).toHaveBeenCalledWith('InjectingBlood3Plugin registered');
    });
});
