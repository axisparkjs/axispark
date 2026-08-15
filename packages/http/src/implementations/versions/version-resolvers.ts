import { HttpRequest } from '../../types';
import { VersionResolver } from '../../version';
import { HeaderVersionOptions, MediaTypeVersionOptions, UriVersionOptions } from '../../plugin/http-plugin-options';
import { Injectable } from '@axisparkjs/di';

@Injectable()
export class HeaderVersionResolver implements VersionResolver {
    resolve(req: HttpRequest, options: HeaderVersionOptions): string | undefined {
        return req.headers[options.header.toLowerCase()] as string | undefined;
    }
}

@Injectable()
export class MediaTypeVersionResolver implements VersionResolver {
    resolve(req: HttpRequest, options: MediaTypeVersionOptions): string | undefined {
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

@Injectable()
export class UriVersionResolver implements VersionResolver {
    resolve(req: HttpRequest, _options: UriVersionOptions): string | undefined {
        return req.params['version'] as string | undefined;
    }
}
