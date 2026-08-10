import { HttpRequest } from '../types';
import { VersionResolver } from './version-resolver';
import { VersioningOptions, HeaderVersioningOptions, MediaTypeVersioningOptions, UriVersioningOptions, VersioningType } from './versioning-options';

export interface VersioningResolver {
    resolve(req: HttpRequest, options: VersioningOptions): string | undefined;
}

export class HeaderVersioningResolver implements VersioningResolver {
    resolve(req: HttpRequest, options: HeaderVersioningOptions): string | undefined {
        return req.headers[options.header.toLowerCase()] as string | undefined;
    }
}

export class MediaTypeVersioningResolver implements VersioningResolver {
    resolve(req: HttpRequest, options: MediaTypeVersioningOptions): string | undefined {
        const contentType = req.getHeader('content-type');
        if (contentType && typeof contentType === 'string') {
            const mediaType = contentType.split(';')[0].trim();
            const version = mediaType.split('+')[1];
            if (version) {
                const params = new URLSearchParams(version);
                return params.get(options.key) ?? undefined;
            }
        }
        return undefined;
    }
}

export class UriVersioningResolver implements VersioningResolver {
    resolve(req: HttpRequest, _options: UriVersioningOptions): string | undefined {
        return req.params['version'] as string | undefined;
    }
}

VersionResolver.addResolver(VersioningType.Header, new HeaderVersioningResolver());
VersionResolver.addResolver(VersioningType.MediaType, new MediaTypeVersioningResolver());
VersionResolver.addResolver(VersioningType.Uri, new UriVersioningResolver());