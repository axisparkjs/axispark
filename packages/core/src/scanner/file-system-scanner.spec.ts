import fg from 'fast-glob';
import { FileSystemScanner } from './file-system-scanner';

jest.mock('fast-glob');

const mockedFg = fg as jest.MockedFunction<typeof fg>;

describe('FileSystemScanner', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should scan js and ts files with the expected configuration', async () => {
        mockedFg.mockResolvedValue([]);

        const importer = jest.fn().mockResolvedValue({});
        const scanner = new FileSystemScanner('/project', importer);

        await scanner.scan();

        expect(mockedFg).toHaveBeenCalledWith(['**/*.{js,ts}'], {
            cwd: '/project',
            absolute: true,
            ignore: ['**/node_modules/**', '**/dist/**', '**/index.bootstrap.ts', '**/index.bootstrap.js', '**/*.d.ts', '**/*.spec.ts', '**/*.spec.js']
        });
    });

    it('should import every discovered file', async () => {
        mockedFg.mockResolvedValue(['/project/a.ts', '/project/b.js']);

        const importer = jest.fn().mockResolvedValue({});
        const scanner = new FileSystemScanner('/project', importer);

        await scanner.scan();

        expect(importer).toHaveBeenCalledTimes(2);
        expect(importer).toHaveBeenNthCalledWith(1, '/project/a.ts');
        expect(importer).toHaveBeenNthCalledWith(2, '/project/b.js');
    });

    it('should propagate errors from fast-glob', async () => {
        const error = new Error('scan error');
        mockedFg.mockRejectedValue(error);

        const importer = jest.fn();
        const scanner = new FileSystemScanner('/project', importer);

        await expect(scanner.scan()).rejects.toThrow(error);

        expect(importer).not.toHaveBeenCalled();
    });

    it('should propagate errors from an imported module', async () => {
        mockedFg.mockResolvedValue(['/project/a.ts', '/project/b.ts']);

        const error = new Error('import error');

        const importer = jest.fn().mockResolvedValueOnce({}).mockRejectedValueOnce(error);

        const scanner = new FileSystemScanner('/project', importer);

        await expect(scanner.scan()).rejects.toThrow(error);
    });

    it('should use the default importer if none is provided', async () => {
        mockedFg.mockResolvedValue(['/project/a.ts']);

        const scanner = new FileSystemScanner('/project');

        try {
            await scanner.scan();
        } catch {
            /* ignore */
        }

        expect(mockedFg).toHaveBeenCalledWith(['**/*.{js,ts}'], {
            cwd: '/project',
            absolute: true,
            ignore: ['**/node_modules/**', '**/dist/**', '**/index.bootstrap.ts', '**/index.bootstrap.js', '**/*.d.ts', '**/*.spec.ts', '**/*.spec.js']
        });
    });
});
