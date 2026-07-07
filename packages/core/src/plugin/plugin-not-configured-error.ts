export class PluginNotConfiguredError extends Error {
    constructor(name: string) {
        super(`${name} added without configuration when it was required. Please provide a configuration object when adding the plugin.`);
        this.name = 'PluginNotConfiguredError';
    }
}
