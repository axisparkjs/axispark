export class PluginConfigMismatchError extends Error {
    constructor(name: string) {
        super(`${name} configuration does not match the expected format.`);
        this.name = 'PluginConfigMismatchError';
    }
}
