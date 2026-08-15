import { VersionDefinition } from './version-definition';

describe('VersionDefinition', () => {
    describe('constructor', () => {
        it('should store the accepted versions', () => {
            const acceptedVersions = ['1', '2', '3'];

            const definition = new VersionDefinition(acceptedVersions);

            expect(definition.acceptedVersions).toBe(acceptedVersions);
        });

        it('should initialize version as undefined', () => {
            const definition = new VersionDefinition(['1', '2']);

            expect(definition.version).toBeUndefined();
        });
    });

    describe('setVersion', () => {
        it('should set the requested version', () => {
            const definition = new VersionDefinition(['1', '2']);

            definition.setVersion('2');

            expect(definition.version).toBe('2');
        });

        it('should allow setting version to undefined', () => {
            const definition = new VersionDefinition(['1', '2']);

            definition.setVersion('2');
            definition.setVersion(undefined);

            expect(definition.version).toBeUndefined();
        });
    });

    describe('isVersionAccepted', () => {
        it('should return true when the version is accepted', () => {
            const definition = new VersionDefinition(['1', '2']);

            definition.setVersion('2');

            expect(definition.isVersionAccepted()).toBe(true);
        });

        it('should return false when the version is not accepted', () => {
            const definition = new VersionDefinition(['1', '2']);

            definition.setVersion('3');

            expect(definition.isVersionAccepted()).toBe(false);
        });

        it('should return false when no version has been set', () => {
            const definition = new VersionDefinition(['1', '2']);

            expect(definition.isVersionAccepted()).toBe(false);
        });

        it('should return false when the accepted versions are empty', () => {
            const definition = new VersionDefinition([]);

            definition.setVersion('1');

            expect(definition.isVersionAccepted()).toBe(false);
        });

        it('should compare versions exactly', () => {
            const definition = new VersionDefinition(['1.0', '2.0']);

            definition.setVersion('1');

            expect(definition.isVersionAccepted()).toBe(false);
        });

        it('should accept any version when default is accepted', () => {
            const definition = new VersionDefinition(['default']);

            definition.setVersion('1');

            expect(definition.isVersionAccepted()).toBe(true);
        });

        it('should accept any version when default is among the accepted versions', () => {
            const definition = new VersionDefinition(['1', 'default']);

            definition.setVersion('3');

            expect(definition.isVersionAccepted()).toBe(true);
        });

        it('should accept an undefined version when default is accepted', () => {
            const definition = new VersionDefinition(['default']);

            expect(definition.isVersionAccepted()).toBe(true);
        });

        it('should still accept an explicitly accepted version when default is present', () => {
            const definition = new VersionDefinition(['1', 'default']);

            definition.setVersion('1');

            expect(definition.isVersionAccepted()).toBe(true);
        });

        it('should not accept an unaccepted version without default', () => {
            const definition = new VersionDefinition(['1', '2']);

            definition.setVersion('3');

            expect(definition.isVersionAccepted()).toBe(false);
        });
    });
});
