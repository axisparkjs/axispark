import { Metadata, MetadataKeys } from '../metadata';

export function Constructable(): ClassDecorator {
    return (target) => {
        Metadata.define(MetadataKeys.CONSTRUCTABLE, true, target);
    };
}
