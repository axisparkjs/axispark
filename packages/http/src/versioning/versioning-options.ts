import { HttpRequest } from '../types';

export enum VersioningType {
    Uri = 'uri',
    Header = 'header',
    MediaType = 'media-type',
    Custom = 'custom',
}

export type VersioningOptions = HeaderVersioningOptions | MediaTypeVersioningOptions | UriVersioningOptions | CustomVersioningOptions;

export interface HeaderVersioningOptions {
    type: VersioningType.Header;
    header: string;
}

export interface MediaTypeVersioningOptions {
    type: VersioningType.MediaType;
    key: string;
}

export interface UriVersioningOptions {
    type: VersioningType.Uri;
    defaultVersion?: string;
}

export interface CustomVersioningOptions {
    type: VersioningType.Custom;
    resolver: (req: HttpRequest) => string | undefined;
}