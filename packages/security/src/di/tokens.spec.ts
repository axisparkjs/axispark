import { SECURITY_LOGGER, SECURITY_OPTIONS } from './tokens';

describe('security injection tokens', () => {
    it('exposes distinct tokens with stable descriptions', () => {
        expect(SECURITY_OPTIONS.description).toBe('SECURITY_OPTIONS');
        expect(SECURITY_LOGGER.description).toBe('SECURITY_LOGGER');
        expect(SECURITY_OPTIONS).not.toBe(SECURITY_LOGGER);
    });
});
