import { MetadataKeys } from '@axisparkjs/common/src';
import { Compose } from '@axisparkjs/common/decorators/compose';

export function ErrorHandler(): ClassDecorator {
    return Compose(MetadataKeys.CONSTRUCTABLE, MetadataKeys.INJECTABLE, MetadataKeys.ERROR_HANDLER);
}
