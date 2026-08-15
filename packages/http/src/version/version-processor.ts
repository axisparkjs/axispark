import { Inject, Injectable } from '@axisparkjs/di';
import { Processable } from '@axisparkjs/common';
import { VersionType } from './version-type';
import { VersionResolver } from './version-resolver';
import { HttpPluginOptions, VersionOptions } from '../plugin/http-plugin-options';
import { VersionDefinition } from './version-definition';
import { HttpContext } from '../types';
import { HTTP_OPTIONS } from '../di';

@Injectable()
export class VersionProcessor implements Processable {
    private static resolvers = new Map<VersionType, VersionResolver>();
    private readonly versionOptions: VersionOptions | undefined;

    constructor(@Inject(HTTP_OPTIONS) httpOptions: HttpPluginOptions) {
        this.versionOptions = httpOptions.versionOptions;
    }

    static registerVersion(type: VersionType, resolver: VersionResolver): void {
        this.resolvers.set(type, resolver);
    }

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
