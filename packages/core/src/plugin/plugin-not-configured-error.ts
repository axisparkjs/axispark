/**
 * Error thrown when a plugin is added without configuration when it was required.
 */
export class PluginNotConfiguredError extends Error {
    /**
     * Creates a new instance of the `PluginNotConfiguredError` class.
     * @param name The name of the plugin that was added without configuration.
     */
    constructor(name: string) {
        super(`${name} added without configuration when it was required. Please provide a configuration object when adding the plugin.`);
        this.name = 'PluginNotConfiguredError';
    }
}
