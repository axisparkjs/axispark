/**
 * Enumeration of version types used in HTTP requests. Each version type corresponds to a different method of specifying the version, such as in the URI, headers, media type, or a custom method.
 */
export enum VersionType {
    Uri = 'uri',
    Header = 'header',
    MediaType = 'media-type',
    Custom = 'custom'
}
