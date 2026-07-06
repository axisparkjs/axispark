import { MetadataKeys } from '../metadata';
import { Compose } from './compose';

export function Injectable(): ClassDecorator {
    return Compose(MetadataKeys.CONSTRUCTABLE, MetadataKeys.INJECTABLE);
}
