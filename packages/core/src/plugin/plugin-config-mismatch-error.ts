/**
 * Error thrown when a plugin's configuration does not match the expected format.
 */
export class PluginConfigMismatchError extends Error {
    /**
     * Creates a new instance of the `PluginConfigMismatchError` class.
     * @param name The name of the plugin whose configuration does not match the expected format.
     */
    constructor(name: string) {
        super(`${name} configuration does not match the expected format.`);
        this.name = 'PluginConfigMismatchError';
    }
}
