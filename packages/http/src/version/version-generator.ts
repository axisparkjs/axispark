import { Generator } from '@axisparkjs/common';
import { Inject, Injectable } from '@axisparkjs/di';
import { VersionDefinition } from './version-definition';
import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { HttpContext } from '../types';
import { ControllerMetadata, RouteMetadata } from '../metadata';
import { HttpPluginOptions, VersionOptions } from '../plugin/http-plugin-options';
import { VersionType } from './version-type';
import { HTTP_OPTIONS } from '../di';

@Injectable()
export class VersionGenerator implements Generator<VersionDefinition | undefined> {
    private readonly versionOptions: VersionOptions | undefined;

    constructor(@Inject(HTTP_OPTIONS) httpOptions: HttpPluginOptions) {
        this.versionOptions = httpOptions.versionOptions;
    }

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
