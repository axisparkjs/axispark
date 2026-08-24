import { access, cp, readFile, writeFile } from 'node:fs/promises';

import { directoryExists, copyTemplate, updatePackageJson } from './filesystem';

jest.mock('node:fs/promises', () => ({
    access: jest.fn(),
    cp: jest.fn(),
    readFile: jest.fn(),
    writeFile: jest.fn()
}));

jest.mock('node:path', () => ({
    resolve: jest.fn(),
    join: jest.fn()
}));

import path from 'node:path';

const mockedAccess = access as jest.MockedFunction<typeof access>;
const mockedCp = cp as jest.MockedFunction<typeof cp>;
const mockedReadFile = readFile as jest.MockedFunction<typeof readFile>;
const mockedWriteFile = writeFile as jest.MockedFunction<typeof writeFile>;

const mockedPathResolve = path.resolve as jest.MockedFunction<typeof path.resolve>;

const mockedPathJoin = path.join as jest.MockedFunction<typeof path.join>;

describe('filesystem utils', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('directoryExists', () => {
        it('returns true when the directory exists', async () => {
            mockedAccess.mockResolvedValue(undefined);

            const result = await directoryExists('/projects/my-project');

            expect(result).toBe(true);
            expect(mockedAccess).toHaveBeenCalledWith('/projects/my-project');
        });

        it('returns false when the directory does not exist', async () => {
            mockedAccess.mockRejectedValue(new Error('ENOENT'));

            const result = await directoryExists('/projects/my-project');

            expect(result).toBe(false);
            expect(mockedAccess).toHaveBeenCalledWith('/projects/my-project');
        });

        it('returns false for any access error', async () => {
            mockedAccess.mockRejectedValue(new Error('Permission denied'));

            const result = await directoryExists('/projects/my-project');

            expect(result).toBe(false);
        });
    });

    describe('copyTemplate', () => {
        it('copies the default template to the destination', async () => {
            mockedPathResolve.mockReturnValue('/templates/default');

            mockedCp.mockResolvedValue(undefined);

            await copyTemplate('/projects/my-project');

            expect(mockedPathResolve).toHaveBeenCalledWith(expect.any(String), '../../../../templates/default');

            expect(mockedCp).toHaveBeenCalledWith('/templates/default', '/projects/my-project', {
                recursive: true
            });
        });

        it('uses recursive copy', async () => {
            mockedPathResolve.mockReturnValue('/templates/default');

            await copyTemplate('/projects/my-project');

            expect(mockedCp).toHaveBeenCalledWith(
                '/templates/default',
                '/projects/my-project',
                expect.objectContaining({
                    recursive: true
                })
            );
        });

        it('propagates errors from cp', async () => {
            mockedPathResolve.mockReturnValue('/templates/default');

            const error = new Error('Copy failed');

            mockedCp.mockRejectedValue(error);

            await expect(copyTemplate('/projects/my-project')).rejects.toThrow('Copy failed');
        });
    });

    describe('updatePackageJson', () => {
        it('reads package.json from the project directory', async () => {
            mockedPathJoin.mockReturnValue('/projects/my-project/package.json');

            mockedReadFile.mockResolvedValue(
                JSON.stringify({
                    name: 'old-name',
                    version: '1.0.0'
                })
            );

            await updatePackageJson('/projects/my-project', 'my-project');

            expect(mockedPathJoin).toHaveBeenCalledWith('/projects/my-project', 'package.json');

            expect(mockedReadFile).toHaveBeenCalledWith('/projects/my-project/package.json', 'utf8');
        });

        it('updates the package name', async () => {
            mockedPathJoin.mockReturnValue('/projects/my-project/package.json');

            mockedReadFile.mockResolvedValue(
                JSON.stringify({
                    name: 'old-name',
                    version: '1.0.0',
                    description: 'My project'
                })
            );

            await updatePackageJson('/projects/my-project', 'new-project');

            expect(mockedWriteFile).toHaveBeenCalledWith('/projects/my-project/package.json', expect.stringContaining('"name": "new-project"'));
        });

        it('preserves the other package.json properties', async () => {
            mockedPathJoin.mockReturnValue('/projects/my-project/package.json');

            mockedReadFile.mockResolvedValue(
                JSON.stringify({
                    name: 'old-name',
                    version: '1.0.0',
                    description: 'My project',
                    scripts: {
                        dev: 'node index.js'
                    }
                })
            );

            await updatePackageJson('/projects/my-project', 'new-project');

            const [, content] = mockedWriteFile.mock.calls[0];

            const packageJson = JSON.parse(content as string);

            expect(packageJson).toEqual({
                name: 'new-project',
                version: '1.0.0',
                description: 'My project',
                scripts: {
                    dev: 'node index.js'
                }
            });
        });

        it('writes formatted JSON with a trailing newline', async () => {
            mockedPathJoin.mockReturnValue('/projects/my-project/package.json');

            mockedReadFile.mockResolvedValue(
                JSON.stringify({
                    name: 'old-name',
                    version: '1.0.0'
                })
            );

            await updatePackageJson('/projects/my-project', 'new-project');

            expect(mockedWriteFile).toHaveBeenCalledWith('/projects/my-project/package.json', '{\n  "name": "new-project",\n  "version": "1.0.0"\n}\n');
        });

        it('propagates errors when reading package.json fails', async () => {
            mockedPathJoin.mockReturnValue('/projects/my-project/package.json');

            mockedReadFile.mockRejectedValue(new Error('Unable to read package.json'));

            await expect(updatePackageJson('/projects/my-project', 'my-project')).rejects.toThrow('Unable to read package.json');

            expect(mockedWriteFile).not.toHaveBeenCalled();
        });

        it('propagates errors when writing package.json fails', async () => {
            mockedPathJoin.mockReturnValue('/projects/my-project/package.json');

            mockedReadFile.mockResolvedValue(
                JSON.stringify({
                    name: 'old-name'
                })
            );

            mockedWriteFile.mockRejectedValue(new Error('Unable to write package.json'));

            await expect(updatePackageJson('/projects/my-project', 'my-project')).rejects.toThrow('Unable to write package.json');
        });

        it('throws when package.json contains invalid JSON', async () => {
            mockedPathJoin.mockReturnValue('/projects/my-project/package.json');

            mockedReadFile.mockResolvedValue('{ invalid json }');

            await expect(updatePackageJson('/projects/my-project', 'my-project')).rejects.toThrow();

            expect(mockedWriteFile).not.toHaveBeenCalled();
        });
    });
});
