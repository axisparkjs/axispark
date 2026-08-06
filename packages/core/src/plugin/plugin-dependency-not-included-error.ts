export class PluginDependencyNotIncludedError extends Error {
    constructor(name: string) {
        super(`Plugin dependency not included: ${name}`);
        this.name = 'PluginDependencyNotIncludedError';
    }
}
