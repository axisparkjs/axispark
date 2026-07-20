import { Constructor, Container, DecoratorNotIncludedError } from '@axisparkjs/di';
import { CatchEntry } from './catch-entry';
import { ControllerMetadata } from '../metadata/controller-metadata';
import { Factory, Metadata, MetadataKeys } from '@axisparkjs/common/src';
import { ErrorHandler } from '../decorators';
import { CatchMetadata } from '../metadata/catch-metadata';
import { HttpContext } from '../types';

export class CatchEntryFactoryStatic implements Factory<CatchEntry[]> {
    create(handlerClass: Constructor, container: Container): CatchEntry[] {
        const handlerMetadata = Metadata.get<ControllerMetadata>(MetadataKeys.ERROR_HANDLER, handlerClass);

        if (!handlerMetadata) throw new DecoratorNotIncludedError(handlerClass.name, ErrorHandler.name);

        const catchs = Metadata.get<CatchMetadata[]>(MetadataKeys.CATCH, handlerClass) ?? [];
        return catchs.map((c) => {
            return {
                ...c,
                handlerClass,
                handler: async (error: any, context: HttpContext) => {
                    const instance = container.resolve<any>(handlerClass);
                    return await instance[c.propertyKey](error, context);
                }
            };
        });
    }
}
export const CatchEntryFactory = new CatchEntryFactoryStatic();
