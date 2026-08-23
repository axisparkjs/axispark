import execa from 'execa';

export async function installDependencies(cwd: string): Promise<void> {
    await execa('npm', ['install'], {
        cwd,
        stdio: 'pipe'
    });
}
