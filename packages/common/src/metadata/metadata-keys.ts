import { MetadataKey } from './metadata-key';

export const MetadataKeys = {
    DESIGN_PARAM_TYPES: new MetadataKey('design:paramtypes'),
    CONSTRUCTABLE: new MetadataKey('constructable'),
    INJECTABLE: new MetadataKey('injectable'),
    INJECT: new MetadataKey('inject'),
    PLUGIN: new MetadataKey('plugin'),
    CONTROLLER: new MetadataKey('controller'),
    ROUTE: new MetadataKey('route'),
    HTTP_CODE: new MetadataKey('http-code'),
    ROUTE_PARAMETER: new MetadataKey('route-parameter'),
    ERROR_HANDLER: new MetadataKey('error-handler'),
    CATCH: new MetadataKey('catch')
} as const;
