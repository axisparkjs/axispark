import execa from 'execa';

import { installDependencies } from './package-manager';

jest.mock('execa', () => ({
    __esModule: true,
    default: jest.fn()
}));

const mockedExeca = execa as jest.MockedFunction<typeof execa>;

describe('package-manager', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('installDependencies', () => {
        it('runs npm install in the provided directory', async () => {
            mockedExeca.mockResolvedValue({} as any);

            await installDependencies('/projects/my-project');

            expect(mockedExeca).toHaveBeenCalledWith('npm', ['install'], {
                cwd: '/projects/my-project',
                stdio: 'pipe'
            });
        });

        it('resolves when npm install succeeds', async () => {
            mockedExeca.mockResolvedValue({} as any);

            await expect(installDependencies('/projects/my-project')).resolves.toBeUndefined();
        });

        it('propagates the error when npm install fails', async () => {
            const error = new Error('npm install failed');

            mockedExeca.mockRejectedValue(error);

            await expect(installDependencies('/projects/my-project')).rejects.toThrow('npm install failed');
        });

        it('uses the provided cwd', async () => {
            mockedExeca.mockResolvedValue({} as any);

            await installDependencies('/tmp/test-project');

            expect(mockedExeca).toHaveBeenCalledWith(
                'npm',
                ['install'],
                expect.objectContaining({
                    cwd: '/tmp/test-project'
                })
            );
        });

        it('uses pipe for stdio', async () => {
            mockedExeca.mockResolvedValue({} as any);

            await installDependencies('/projects/my-project');

            expect(mockedExeca).toHaveBeenCalledWith(
                'npm',
                ['install'],
                expect.objectContaining({
                    stdio: 'pipe'
                })
            );
        });
    });
});
