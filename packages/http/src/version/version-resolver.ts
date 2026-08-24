import { HttpRequest } from '../types';
import { VersionOptions } from '../plugin/http-plugin-options';

/**
 * An interface for resolving version information from HTTP requests.
 */
export interface VersionResolver {
    /**
     * Resolves the version from the given HTTP request based on the provided version options.
     * @param req The HTTP request from which to resolve the version.
     * @param options The version options that may influence the resolution process.
     * @returns The resolved version as a string, or undefined if no version could be resolved.
     */
    resolve(req: HttpRequest, options: VersionOptions): string | undefined;
}
