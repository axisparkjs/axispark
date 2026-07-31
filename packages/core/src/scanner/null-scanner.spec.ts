import { NullScanner } from './null-scanner';

describe('NullScanner', () => {
    let scanner: NullScanner;

    beforeEach(() => {
        scanner = new NullScanner();
    });

    it('should resolve when scan is called', async () => {
        await expect(scanner.scan()).resolves.toBeUndefined();
    });
});
