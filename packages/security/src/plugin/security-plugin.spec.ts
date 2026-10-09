import { PluginNotConfiguredError } from '@axisparkjs/core';
import { SECURITY_LOGGER, SECURITY_OPTIONS } from '../di';
import { SecurityPlugin } from './security-plugin';

describe('SecurityPlugin', () => {
    let logger: { child: jest.Mock };
    let childLogger: { info: jest.Mock };

    beforeEach(() => {
        childLogger = { info: jest.fn().mockResolvedValue(undefined) };
        logger = { child: jest.fn().mockReturnValue(childLogger) };
    });

    it('requires configuration', async () => {
        const plugin = new SecurityPlugin(logger as any);

        await expect(plugin.onRegister({ container: { bind: jest.fn() } } as any)).rejects.toBeInstanceOf(PluginNotConfiguredError);
    });

    it('binds options and logger and logs lifecycle events', async () => {
        const bind = jest.fn();
        const plugin = new SecurityPlugin(logger as any);
        const options = { authenticator: { strategy: 'all' } } as any;

        await plugin.onRegister({ container: { bind } } as any, options);

        expect(logger.child).toHaveBeenCalledWith('SecurityPlugin');
        expect(bind).toHaveBeenCalledWith({ token: SECURITY_OPTIONS, useValue: options });
        expect(bind).toHaveBeenCalledWith({ token: SECURITY_LOGGER, useValue: childLogger });
        expect(childLogger.info).toHaveBeenCalledWith('Plugin registered');

        await plugin.onStart();
        await plugin.onStop();

        expect(childLogger.info).toHaveBeenCalledWith('Plugin started');
        expect(childLogger.info).toHaveBeenCalledWith('Plugin stopped');
    });
});
