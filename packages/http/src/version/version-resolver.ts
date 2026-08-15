import { HttpRequest } from '../types';
import { VersionOptions } from '../plugin/http-plugin-options';

export interface VersionResolver {
    resolve(req: HttpRequest, options: VersionOptions): string | undefined;
}
