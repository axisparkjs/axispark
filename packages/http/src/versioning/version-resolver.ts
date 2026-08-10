
import { HttpRequest } from '../types';
import { VersioningOptions, VersioningType } from './versioning-options';
import { VersioningResolver } from './versioning-resolvers';

class VersionResolverStatic {
    private resolvers = new Map<VersioningType, VersioningResolver>();

    addResolver(type: VersioningType, resolver: VersioningResolver): void {
        this.resolvers.set(type, resolver);
    }

    resolve(req: HttpRequest, options: VersioningOptions): string | undefined {
        if (!options || !options.type) return undefined;
        const resolver = this.resolvers.get(options.type);
        if (resolver) {
            return resolver.resolve(req, options);
        }
        return undefined;
    }
}

export const VersionResolver = new VersionResolverStatic();