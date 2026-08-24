/**
 * Represents a version definition for HTTP requests, including accepted versions and the current version. Provides methods to set the current version and check if the current version is accepted.
 */
export class VersionDefinition {
    public version!: string | undefined;

    constructor(public readonly acceptedVersions: string[]) {}

    setVersion(version: string | undefined): void {
        this.version = version;
    }

    isVersionAccepted(): boolean {
        return this.acceptedVersions.some((v) => v === 'default') || (this.version !== undefined && this.acceptedVersions.includes(this.version));
    }
}
