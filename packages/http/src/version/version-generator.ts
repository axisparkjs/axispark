import { Generator } from '@axisparkjs/common';
import { Inject, Injectable } from '@axisparkjs/di';
import { VersionDefinition } from './version-definition';
import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { HttpContext } from '../types';
import { ControllerMetadata, RouteMetadata } from '../metadata';
import { HttpPluginOptions, VersionOptions } from '../plugin/http-plugin-options';
import { VersionType } from './version-type';
import { HTTP_OPTIONS } from '../di';

/**
 * A generator class for creating version definitions based on the HTTP context. It retrieves version information from controller and route metadata, as well as from the provided version options. The generated version definition includes accepted versions and the current version.
 */
@Injectable()
export class VersionGenerator implements Generator<VersionDefinition | undefined> {
    private readonly versionOptions: VersionOptions | undefined;

    constructor(@Inject(HTTP_OPTIONS) httpOptions: HttpPluginOptions) {
        this.versionOptions = httpOptions.versionOptions;
    }

    /**
     * Generates a version definition based on the HTTP context.
     * @param context The HTTP context.
     * @returns The generated version definition or undefined if no version options are available.
     */
    generate(context: HttpContext): VersionDefinition | undefined {
        if (!this.versionOptions) return undefined;

        const controllerMetadata = Metadata.get<ControllerMetadata>(MetadataKeys.CONTROLLER, context.target);
        const routeMetadata = Metadata.get<RouteMetadata>(MetadataKeys.ROUTE, context.target, context.propertyKey);

        const controllerVersions = controllerMetadata?.version
            ? typeof controllerMetadata.version === 'string'
                ? [controllerMetadata.version]
                : controllerMetadata.version
            : undefined;
        const routeVersions = routeMetadata?.version
            ? typeof routeMetadata.version === 'string'
                ? [routeMetadata.version]
                : routeMetadata.version
            : undefined;

        const acceptedVersions =
            routeVersions ??
            controllerVersions ??
            (this.versionOptions.type === VersionType.Uri && this.versionOptions.defaultVersion ? [this.versionOptions.defaultVersion] : ['default']);

        return new VersionDefinition(acceptedVersions);
    }
}
