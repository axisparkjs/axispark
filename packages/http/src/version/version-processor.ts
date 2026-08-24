import { Inject, Injectable } from '@axisparkjs/di';
import { Processable } from '@axisparkjs/common';
import { VersionType } from './version-type';
import { VersionResolver } from './version-resolver';
import { HttpPluginOptions, VersionOptions } from '../plugin/http-plugin-options';
import { VersionDefinition } from './version-definition';
import { HttpContext } from '../types';
import { HTTP_OPTIONS } from '../di';

/**
 * A processor class for handling version definitions based on the HTTP context. It uses registered version resolvers to determine the current version from the request and updates the version definition accordingly.
 */
@Injectable()
export class VersionProcessor implements Processable {
    private static resolvers = new Map<VersionType, VersionResolver>();
    private readonly versionOptions: VersionOptions | undefined;

    constructor(@Inject(HTTP_OPTIONS) httpOptions: HttpPluginOptions) {
        this.versionOptions = httpOptions.versionOptions;
    }

    /**
     * Registers a version resolver for a specific version type.
     * @param type The version type for which the resolver is registered.
     * @param resolver The version resolver to be registered.
     */
    static registerVersion(type: VersionType, resolver: VersionResolver): void {
        this.resolvers.set(type, resolver);
    }

    /**
     * Processes the version definition based on the HTTP context. It uses the registered version resolver to determine the current version from the request and updates the version definition accordingly.
     * @param version The version definition to be processed.
     * @param context The HTTP context containing request, response, and session information.
     */
    process(version: VersionDefinition | undefined, context: Pick<HttpContext, 'request' | 'response' | 'session'>): void {
        const options = this.versionOptions;
        if (!options || !options.type || !version) return;

        const resolver = VersionProcessor.resolvers.get(options.type);
        let resolvedVersion: string | undefined;
        if (resolver) {
            resolvedVersion = resolver.resolve(context.request, options);
        }
        version.setVersion(resolvedVersion);
    }
}
