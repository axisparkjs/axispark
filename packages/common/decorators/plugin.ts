import { MetadataKeys } from '../metadata/metadata-keys';
import { Compose } from './compose';

export function Plugin(): ClassDecorator {
    return Compose(MetadataKeys.CONSTRUCTABLE, MetadataKeys.INJECTABLE, MetadataKeys.PLUGIN);
}
