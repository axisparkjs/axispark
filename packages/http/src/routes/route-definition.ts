import { RouteHandler } from './route-handler';
import { HttpMethod } from '../types';
import { ClassType } from '@axisparkjs/common';

/**
 * A class representing the definition of an HTTP route.
 */
export class RouteDefinition {
    constructor(
        public readonly target: ClassType,
        public readonly propertyKey: string | symbol,
        public readonly httpMethod: HttpMethod,
        public readonly path: string,
        public readonly versions: string[] | undefined,
        public readonly handler: RouteHandler
    ) {}

    /** Compares this route with another route and reports any compatibility issues. */
    compare(other: RouteDefinition): RouteConflict[] {
        if (this.httpMethod.toLowerCase() !== other.httpMethod.toLowerCase()) return [];

        const firstParts = pathParts(this.path);
        const secondParts = pathParts(other.path);
        const firstShape = firstParts.map(normalizeSegment).join('/');
        const secondShape = secondParts.map(normalizeSegment).join('/');
        if (firstShape === secondShape) {
            return [{ type: 'duplicate', routes: [this, other], message: 'routes have the same normalized method and path' }];
        }

        const conflicts: RouteConflict[] = [];
        if (
            firstParts.length === secondParts.length &&
            firstParts.some((part, index) => (isParameter(part) && isStatic(secondParts[index])) || (isParameter(secondParts[index]) && isStatic(part))) &&
            pathsCanOverlap(firstParts, secondParts)
        ) {
            conflicts.push({ type: 'ambiguous', routes: [this, other], message: 'static and dynamic path segments overlap' });
        }

        if (firstParts.some(isWildcard) && wildcardCovers(firstParts, secondParts)) {
            conflicts.push({ type: 'unreachable', routes: [this, other], message: 'earlier wildcard route can shadow this route' });
        }
        return conflicts;
    }
}

export type RouteConflictType = 'duplicate' | 'ambiguous' | 'unreachable';

export interface RouteConflict {
    type: RouteConflictType;
    routes: [RouteDefinition, RouteDefinition];
    message: string;
}

function pathParts(path: string): string[] {
    const normalized = `/${path}`.replace(/\/+/g, '/').replace(/\/$/, '');
    return normalized === '' ? [] : normalized.slice(1).split('/');
}

function isParameter(segment: string): boolean {
    return segment.startsWith(':');
}
function isWildcard(segment: string): boolean {
    return segment === '*' || segment.startsWith('*');
}
function isStatic(segment: string): boolean {
    return !isParameter(segment) && !isWildcard(segment);
}
function normalizeSegment(segment: string): string {
    return isParameter(segment) ? ':' : isWildcard(segment) ? '*' : segment;
}
function segmentsOverlap(a: string, b: string): boolean {
    return a === b || isParameter(a) || isParameter(b) || isWildcard(a) || isWildcard(b);
}
function pathsCanOverlap(a: string[], b: string[]): boolean {
    return a.every((segment, index) => segmentsOverlap(segment, b[index]));
}
function wildcardCovers(earlier: string[], later: string[]): boolean {
    const wildcardIndex = earlier.findIndex(isWildcard);
    return wildcardIndex >= 0 && earlier.slice(0, wildcardIndex).every((segment, index) => index < later.length && segmentsOverlap(segment, later[index]));
}
