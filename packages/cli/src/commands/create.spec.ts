import { createCommand } from './create';

import prompts from 'prompts';
import ora from 'ora';

import {
    directoryExists,
    copyTemplate,
    updatePackageJson,
} from '../utils/filesystem';

import { installDependencies } from '../utils/package-manager';
import { downloadTemplate } from '../utils/template';

jest.mock('prompts', () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock('ora', () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock('../utils/filesystem', () => ({
    directoryExists: jest.fn(),
    copyTemplate: jest.fn(),
    updatePackageJson: jest.fn(),
}));

jest.mock('../utils/package-manager', () => ({
    installDependencies: jest.fn(),
}));

jest.mock('../utils/template', () => ({
    downloadTemplate: jest.fn(),
}));

const mockedPrompts = prompts as jest.MockedFunction<typeof prompts>;
const mockedOra = ora as jest.MockedFunction<typeof ora>;

const mockedDirectoryExists =
    directoryExists as jest.MockedFunction<typeof directoryExists>;

const mockedCopyTemplate =
    copyTemplate as jest.MockedFunction<typeof copyTemplate>;

const mockedUpdatePackageJson =
    updatePackageJson as jest.MockedFunction<typeof updatePackageJson>;

const mockedInstallDependencies =
    installDependencies as jest.MockedFunction<typeof installDependencies>;

const mockedDownloadTemplate =
    downloadTemplate as jest.MockedFunction<typeof downloadTemplate>;

describe('create command', () => {
    let spinner: {
        start: jest.Mock;
        succeed: jest.Mock;
        fail: jest.Mock;
    };

    beforeEach(() => {
        jest.clearAllMocks();

        spinner = {
            start: jest.fn().mockReturnThis(),
            succeed: jest.fn(),
            fail: jest.fn(),
        };

        jest.spyOn(console, 'log').mockImplementation();

        mockedOra.mockReturnValue(spinner as any);

        mockedDirectoryExists.mockResolvedValue(false);

        mockedCopyTemplate.mockResolvedValue(undefined);
        mockedUpdatePackageJson.mockResolvedValue(undefined);
        mockedDownloadTemplate.mockResolvedValue(undefined);
        mockedInstallDependencies.mockResolvedValue(undefined);
    });

    async function runCommand(
        name?: string,
        options?: { template?: string },
    ) {
        await createCommand.parseAsync([
            'node',
            'test',
            ...(name ? [name] : []),
            ...(options?.template
                ? ['--template', options.template]
                : []),
        ]);
    }

    describe('options', () => {
        it('accepts a project name and template as options', async () => {
            mockedPrompts
                .mockResolvedValueOnce({
                    install: false,
                } as any);

            await runCommand('my-project', {
                template: 'http',
            });

            expect(mockedDownloadTemplate).toHaveBeenCalledWith(
                'http',
                'my-project',
            );
        });

        it('builds an options object when no options are provided', async () => {
            mockedPrompts
                .mockResolvedValueOnce({
                    template: 'http',
                })
                .mockResolvedValueOnce({
                    install: false,
                });

            await runCommand('my-project');

            expect(mockedDownloadTemplate).toHaveBeenCalledWith(
                'http',
                'my-project',
            );
        });
    });

    describe('project name', () => {
        it('uses the provided project name', async () => {
            mockedPrompts
                .mockResolvedValueOnce({
                    template: 'default',
                })
                .mockResolvedValueOnce({
                    install: false,
                });

            await runCommand('my-project');

            expect(mockedPrompts).toHaveBeenCalledTimes(2);

            expect(mockedDownloadTemplate).toHaveBeenCalledWith(
                'default',
                'my-project',
            );
        });

        it('asks for the project name when it is not provided', async () => {
            mockedPrompts
                .mockResolvedValueOnce({
                    name: 'my-project',
                })
                .mockResolvedValueOnce({
                    template: 'default',
                })
                .mockResolvedValueOnce({
                    install: false,
                });

            await runCommand();

            expect(mockedPrompts).toHaveBeenNthCalledWith(
                1,
                expect.objectContaining({
                    type: 'text',
                    name: 'name',
                    message: 'What is your project name?',
                }),
            );

            expect(mockedDownloadTemplate).toHaveBeenCalledWith(
                'default',
                'my-project',
            );
        });

        it('rejects an invalid project name', async () => {
            await expect(
                runCommand('my project'),
            ).rejects.toThrow('Invalid project name');

            expect(mockedDirectoryExists).not.toHaveBeenCalled();
            expect(mockedDownloadTemplate).not.toHaveBeenCalled();
        });

        it.each([
            'my.project',
            'my/project',
            'my project',
            'my@project',
            'my$project',
        ])('rejects project name "%s"', async (name) => {
            await expect(runCommand(name)).rejects.toThrow(
                'Invalid project name',
            );
        });

        it.each([
            'my-project',
            'my_project',
            'myProject',
            'my123',
            '123-project',
        ])('accepts project name "%s"', async (name) => {
            mockedPrompts
                .mockResolvedValueOnce({
                    template: 'default',
                })
                .mockResolvedValueOnce({
                    install: false,
                } as any);

            await expect(runCommand(name)).resolves.toBeUndefined();
        });
    });

    describe('existing directory', () => {
        it('exits when the project directory already exists', async () => {
            mockedDirectoryExists.mockResolvedValue(true);

            const exitSpy = jest
                .spyOn(process, 'exit')
                .mockImplementation((() => {
                    throw new Error('process.exit');
                }) as never);

            await expect(runCommand('existing-project')).rejects.toThrow(
                'process.exit',
            );

            expect(mockedDirectoryExists).toHaveBeenCalled();
            expect(mockedDownloadTemplate).not.toHaveBeenCalled();

            expect(exitSpy).toHaveBeenCalledWith(1);

            exitSpy.mockRestore();
        });
    });

    describe('template', () => {
        it('downloads and copies the selected template', async () => {
            mockedPrompts
                .mockResolvedValueOnce({
                    install: false,
                } as any);

            await runCommand('my-project', {
                template: 'http',
            });

            expect(mockedDownloadTemplate).toHaveBeenCalledWith(
                'http',
                'my-project',
            );

            expect(mockedCopyTemplate).toHaveBeenCalledWith(
                expect.stringContaining('my-project'),
            );

            expect(mockedUpdatePackageJson).toHaveBeenCalledWith(
                expect.stringContaining('my-project'),
                'my-project',
            );
        });

        it('asks the user to select a template when none is provided', async () => {
            mockedPrompts
                .mockResolvedValueOnce({
                    template: 'http',
                })
                .mockResolvedValueOnce({
                    install: false,
                });

            await runCommand('my-project');

            expect(mockedPrompts).toHaveBeenNthCalledWith(
                1,
                expect.objectContaining({
                    type: 'select',
                    name: 'template',
                    message: 'Select a template:',
                }),
            );

            expect(mockedDownloadTemplate).toHaveBeenCalledWith(
                'http',
                'my-project',
            );
        });
    });

    describe('project creation errors', () => {
        it('marks the spinner as failed when template download fails', async () => {
            const error = new Error('Download failed');

            mockedDownloadTemplate.mockRejectedValueOnce(error);

            await expect(runCommand('my-project', { template: 'default' })).rejects.toThrow(
                'Download failed',
            );

            expect(spinner.fail).toHaveBeenCalledWith(
                expect.stringContaining('Failed to create project'),
            );
        });

        it('marks the spinner as failed when copying fails', async () => {
            const error = new Error('Copy failed');

            mockedCopyTemplate.mockRejectedValueOnce(error);

            await expect(runCommand('my-project', { template: 'default' })).rejects.toThrow(
                'Copy failed',
            );

            expect(spinner.fail).toHaveBeenCalledWith(
                expect.stringContaining('Failed to create project'),
            );
        });

        it('marks the spinner as successful when creation succeeds', async () => {
            mockedPrompts.mockResolvedValueOnce({
                install: false,
            } as any);

            await runCommand('my-project', { template: 'default' });

            expect(spinner.succeed).toHaveBeenCalledWith(
                expect.stringContaining('Project created'),
            );
        });
    });

    describe('dependencies', () => {
        it('installs dependencies when the user confirms', async () => {
            mockedPrompts.mockResolvedValueOnce({
                install: true,
            } as any);

            await runCommand('my-project', { template: 'default' });

            expect(mockedInstallDependencies).toHaveBeenCalledWith(
                expect.stringContaining('my-project'),
            );
        });

        it('does not install dependencies when the user declines', async () => {
            mockedPrompts.mockResolvedValueOnce({
                install: false,
            } as any);

            await runCommand('my-project', { template: 'default' });

            expect(mockedInstallDependencies).not.toHaveBeenCalled();
        });

        it('marks the installation spinner as successful', async () => {
            mockedPrompts.mockResolvedValueOnce({
                install: true,
            } as any);

            await runCommand('my-project', { template: 'default' });

            expect(spinner.succeed).toHaveBeenCalledWith(
                expect.stringContaining('Dependencies installed'),
            );
        });

        it('marks the installation spinner as failed when installation fails', async () => {
            const error = new Error('npm install failed');

            mockedPrompts.mockResolvedValueOnce({
                install: true,
            } as any);

            mockedInstallDependencies.mockRejectedValueOnce(error);

            await expect(runCommand('my-project', { template: 'default' })).rejects.toThrow(
                'npm install failed',
            );

            expect(spinner.fail).toHaveBeenCalledWith(
                expect.stringContaining('Failed to install dependencies'),
            );
        });
    });

    describe('complete flow', () => {
        it('creates the project and asks to install dependencies', async () => {
            mockedPrompts.mockResolvedValueOnce({
                install: true,
            } as any);

            mockedInstallDependencies.mockResolvedValueOnce(undefined);

            await runCommand('my-project', {
                template: 'http',
            });

            expect(mockedDirectoryExists).toHaveBeenCalledWith(
                expect.stringContaining('my-project'),
            );

            expect(mockedDownloadTemplate).toHaveBeenCalledWith(
                'http',
                'my-project',
            );

            expect(mockedCopyTemplate).toHaveBeenCalledWith(
                expect.stringContaining('my-project'),
            );

            expect(mockedUpdatePackageJson).toHaveBeenCalledWith(
                expect.stringContaining('my-project'),
                'my-project',
            );

            expect(mockedInstallDependencies).toHaveBeenCalledWith(
                expect.stringContaining('my-project'),
            );

            expect(mockedPrompts).toHaveBeenCalledTimes(1);
        });
    });
});