/**
 * Error thrown when a plugin is already registered.
 */
export class PluginAlreadyRegisteredError extends Error {
    /**
     * Creates a new instance of the `PluginAlreadyRegisteredError` class.
     * @param name The name of the plugin that is already registered.
     */
    constructor(name: string) {
        super(`${name} is already registered`);
        this.name = 'PluginAlreadyRegisteredError';
    }
}
