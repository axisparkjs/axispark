export class VersionDefinition {
    public version!: string | undefined;

    constructor(public readonly acceptedVersions: string[]) {}

    setVersion(version: string | undefined): void {
        this.version = version;
    }

    isVersionAccepted(): boolean {
        return this.version !== undefined && this.acceptedVersions.includes(this.version);
    }
}