import { Constructor } from '@axisparkjs/di';
import { CatchMetadata } from '../metadata/catch-metadata';
import { CatchHandler } from './catch-handler';

export interface CatchEntry extends CatchMetadata {
    handlerClass: Constructor;
    handler: CatchHandler;
}
