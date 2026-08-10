
import { HttpRequest } from '../types';
import { ControllerMetadata, RouteMetadata } from '../metadata';
import { VersioningOptions, VersioningType } from './versioning-options';
import { VersionResolver } from './version-resolver';

class VersioningUtilsStatic {
    isVersionValid(request: HttpRequest, options: VersioningOptions | undefined, controller: ControllerMetadata, route: RouteMetadata): boolean {
        if (!options) return true;
        if (options.type === VersioningType.Uri) {
            route.version = route.version || options.defaultVersion;
            controller.version = controller.version || options.defaultVersion;
        }

        const version = VersionResolver.resolve(request, options);
        if (version === undefined) return true;
        if (route.version && route.version.includes(version)) return true;
        if (controller.version && controller.version.includes(version)) return true;

        if (!route.version && !controller.version) return true;
        return false;
    }
}

export const VersioningUtils = new VersioningUtilsStatic();