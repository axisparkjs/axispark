import { access, readFile, writeFile } from 'node:fs/promises';

import path from 'node:path';

export async function directoryExists(directory: string): Promise<boolean> {
    try {
        await access(directory);
        return true;
    } catch {
        return false;
    }
}

export async function updatePackageJson(projectPath: string, projectName: string): Promise<void> {
    const packageJsonPath = path.join(projectPath, 'package.json');

    const content = await readFile(packageJsonPath, 'utf8');

    const packageJson = JSON.parse(content);

    packageJson.name = projectName;

    await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
}
