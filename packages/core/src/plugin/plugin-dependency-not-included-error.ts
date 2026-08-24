/**
 * Error thrown when a plugin dependency is not included.
 */
export class PluginDependencyNotIncludedError extends Error {
    /**
     * Creates a new instance of the `PluginDependencyNotIncludedError` class.
     * @param name The name of the plugin dependency that is not included.
     */
    constructor(name: string) {
        super(`Plugin dependency not included: ${name}`);
        this.name = 'PluginDependencyNotIncludedError';
    }
}
