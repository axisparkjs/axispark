import { execFile } from 'node:child_process';
import {
    mkdtemp,
    readFile,
    rm,
    access,
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const CLI_PATH = path.resolve(
    __dirname,
    '../packages/cli/lib/index.js',
);

describe('create command - CLI', () => {
    let tempDirectory: string;

    beforeEach(async () => {
        tempDirectory = await mkdtemp(
            path.join(os.tmpdir(), 'axispark-e2e-'),
        );
    });

    afterEach(async () => {
        await rm(tempDirectory, {
            recursive: true,
            force: true,
        });
    });

    it('creates a project from the default template', async () => {
        const projectName = 'my-e2e-project';

        await execFileAsync(
            process.execPath,
            [
                CLI_PATH,
                'create',
                projectName,
                '--template',
                'default',
                '--no-install'
            ],
            {
                cwd: tempDirectory,
                env: {
                    ...process.env,
                },
            },
        );

        const projectPath = path.join(
            tempDirectory,
            projectName,
        );

        await expectFileToExist(projectPath);

        const packageJsonPath = path.join(
            projectPath,
            'package.json',
        );

        const packageJsonContent = await readFile(
            packageJsonPath,
            'utf8',
        );

        const packageJson = JSON.parse(
            packageJsonContent,
        );

        expect(packageJson.name).toBe(projectName);
    });

    it('fails when the project already exists', async () => {
        const projectName = 'existing-project';

        const projectPath = path.join(
            tempDirectory,
            projectName,
        );

        await import('node:fs/promises').then(
            ({ mkdir }) => mkdir(projectPath),
        );

        await expect(
            execFileAsync(
                process.execPath,
                [
                    CLI_PATH,
                    'create',
                    projectName,
                    '--template',
                    'basic',
                ],
                {
                    cwd: tempDirectory,
                    env: {
                        ...process.env,
                    },
                },
            ),
        ).rejects.toMatchObject({
            code: 1,
        });
    });

    it('fails with an invalid project name', async () => {
        await expect(
            execFileAsync(
                process.execPath,
                [
                    CLI_PATH,
                    'create',
                    'my project',
                    '--template',
                    'basic',
                ],
                {
                    cwd: tempDirectory,
                    env: {
                        ...process.env,
                    },
                },
            ),
        ).rejects.toThrow('Invalid project name');
    });
});

async function expectFileToExist(
    filePath: string,
): Promise<void> {
    await expect(
        access(filePath),
    ).resolves.toBeUndefined();
}