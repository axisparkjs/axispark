export class PluginAlreadyRegisteredError extends Error {
    constructor(name: string) {
        super(`${name} is already registered.`);
        this.name = 'PluginAlreadyRegisteredError';
    }
}
