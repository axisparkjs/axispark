import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { VersionGenerator } from './version-generator';
import { VersionDefinition } from './version-definition';
import { VersionType } from './version-type';
import { HttpPluginOptions } from '../plugin/http-plugin-options';
import { HttpContext } from '../types';

jest.mock('@axisparkjs/common', () => ({
    ...jest.requireActual('@axisparkjs/common'),
    Metadata: {
        get: jest.fn(),
        normalizeTarget: jest.fn((target) => target),
        define: jest.fn()
    }
}));

describe('VersionGenerator', () => {
    class TestController {}

    const context = {
        target: TestController,
        propertyKey: 'index'
    } as unknown as HttpContext;

    const createGenerator = (versionOptions?: HttpPluginOptions['versionOptions']) => {
        return new VersionGenerator({
            adapter: class TestAdapter {},
            port: 3000,
            versionOptions
        } as HttpPluginOptions);
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('generate', () => {
        it('should return undefined when version options are not configured', () => {
            const generator = createGenerator();

            const result = generator.generate(context);

            expect(result).toBeUndefined();
            expect(Metadata.get).not.toHaveBeenCalled();
        });

        it('should return a VersionDefinition when versioning is configured', () => {
            const generator = createGenerator({
                type: VersionType.Header
            } as any);

            (Metadata.get as jest.Mock)
                .mockReturnValueOnce({
                    version: '1'
                })
                .mockReturnValueOnce({
                    version: '2'
                });

            const result = generator.generate(context);

            expect(result).toBeInstanceOf(VersionDefinition);
        });

        it('should use the controller version when no route version is defined', () => {
            const generator = createGenerator({
                type: VersionType.Header
            } as any);

            (Metadata.get as jest.Mock)
                .mockReturnValueOnce({
                    version: '1'
                })
                .mockReturnValueOnce(undefined);

            const result = generator.generate(context);

            expect(result?.acceptedVersions).toEqual(['1']);
        });

        it('should prefer the route version over the controller version', () => {
            const generator = createGenerator({
                type: VersionType.Header
            } as any);

            (Metadata.get as jest.Mock)
                .mockReturnValueOnce({
                    version: '1'
                })
                .mockReturnValueOnce({
                    version: '2'
                });

            const result = generator.generate(context);

            expect(result?.acceptedVersions).toEqual(['2']);
        });

        it('should support a string controller version', () => {
            const generator = createGenerator({
                type: VersionType.Header
            } as any);

            (Metadata.get as jest.Mock)
                .mockReturnValueOnce({
                    version: '1'
                })
                .mockReturnValueOnce(undefined);

            const result = generator.generate(context);

            expect(result?.acceptedVersions).toEqual(['1']);
        });

        it('should support multiple controller versions', () => {
            const generator = createGenerator({
                type: VersionType.Header
            } as any);

            (Metadata.get as jest.Mock)
                .mockReturnValueOnce({
                    version: ['1', '2']
                })
                .mockReturnValueOnce(undefined);

            const result = generator.generate(context);

            expect(result?.acceptedVersions).toEqual(['1', '2']);
        });

        it('should support a string route version', () => {
            const generator = createGenerator({
                type: VersionType.Header
            } as any);

            (Metadata.get as jest.Mock).mockReturnValueOnce(undefined).mockReturnValueOnce({
                version: '2'
            });

            const result = generator.generate(context);

            expect(result?.acceptedVersions).toEqual(['2']);
        });

        it('should support multiple route versions', () => {
            const generator = createGenerator({
                type: VersionType.Header
            } as any);

            (Metadata.get as jest.Mock).mockReturnValueOnce(undefined).mockReturnValueOnce({
                version: ['2', '3']
            });

            const result = generator.generate(context);

            expect(result?.acceptedVersions).toEqual(['2', '3']);
        });

        it('should prefer multiple route versions over multiple controller versions', () => {
            const generator = createGenerator({
                type: VersionType.Header
            } as any);

            (Metadata.get as jest.Mock)
                .mockReturnValueOnce({
                    version: ['1', '2']
                })
                .mockReturnValueOnce({
                    version: ['3', '4']
                });

            const result = generator.generate(context);

            expect(result?.acceptedVersions).toEqual(['3', '4']);
        });

        it('should use the default version when URI versioning is enabled', () => {
            const generator = createGenerator({
                type: VersionType.Uri,
                defaultVersion: '1'
            } as any);

            (Metadata.get as jest.Mock).mockReturnValueOnce(undefined).mockReturnValueOnce(undefined);

            const result = generator.generate(context);

            expect(result?.acceptedVersions).toEqual(['1']);
        });

        it('should not use the default version when controller version is defined', () => {
            const generator = createGenerator({
                type: VersionType.Uri,
                defaultVersion: '3'
            } as any);

            (Metadata.get as jest.Mock)
                .mockReturnValueOnce({
                    version: ['1', '2']
                })
                .mockReturnValueOnce(undefined);

            const result = generator.generate(context);

            expect(result?.acceptedVersions).toEqual(['1', '2']);
        });

        it('should not use the default version when route version is defined', () => {
            const generator = createGenerator({
                type: VersionType.Uri,
                defaultVersion: '3'
            } as any);

            (Metadata.get as jest.Mock)
                .mockReturnValueOnce({
                    version: ['1', '2']
                })
                .mockReturnValueOnce({
                    version: '4'
                });

            const result = generator.generate(context);

            expect(result?.acceptedVersions).toEqual(['4']);
        });

        it('should use the default version for header versioning when no metadata is defined', () => {
            const generator = createGenerator({
                type: VersionType.Header,
                defaultVersion: '3'
            } as any);

            (Metadata.get as jest.Mock).mockReturnValueOnce(undefined).mockReturnValueOnce(undefined);

            const result = generator.generate(context);

            expect(result?.acceptedVersions).toEqual(['default']);
        });

        it('should use the default version for media type versioning when no metadata is defined', () => {
            const generator = createGenerator({
                type: VersionType.MediaType,
                defaultVersion: '3'
            } as any);

            (Metadata.get as jest.Mock).mockReturnValueOnce(undefined).mockReturnValueOnce(undefined);

            const result = generator.generate(context);

            expect(result?.acceptedVersions).toEqual(['default']);
        });

        it('should use the default marker when URI versioning has no defaultVersion', () => {
            const generator = createGenerator({
                type: VersionType.Uri
            } as any);

            (Metadata.get as jest.Mock).mockReturnValueOnce(undefined).mockReturnValueOnce(undefined);

            const result = generator.generate(context);

            expect(result?.acceptedVersions).toEqual(['default']);
        });

        it('should use the default marker when no controller or route metadata exists', () => {
            const generator = createGenerator({
                type: VersionType.Header
            } as any);

            (Metadata.get as jest.Mock).mockReturnValueOnce(undefined).mockReturnValueOnce(undefined);

            const result = generator.generate(context);

            expect(result).toBeInstanceOf(VersionDefinition);
            expect(result?.acceptedVersions).toEqual(['default']);
        });

        it('should query controller metadata using the target', () => {
            const generator = createGenerator({
                type: VersionType.Header
            } as any);

            (Metadata.get as jest.Mock).mockReturnValueOnce(undefined).mockReturnValueOnce(undefined);

            generator.generate(context);

            expect(Metadata.get).toHaveBeenNthCalledWith(1, MetadataKeys.CONTROLLER, context.target);
        });

        it('should query route metadata using target and property key', () => {
            const generator = createGenerator({
                type: VersionType.Header
            } as any);

            (Metadata.get as jest.Mock).mockReturnValueOnce(undefined).mockReturnValueOnce(undefined);

            generator.generate(context);

            expect(Metadata.get).toHaveBeenNthCalledWith(2, MetadataKeys.ROUTE, context.target, context.propertyKey);
        });
    });
});
