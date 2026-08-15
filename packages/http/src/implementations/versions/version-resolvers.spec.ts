import { HeaderVersionResolver, MediaTypeVersionResolver, UriVersionResolver } from './version-resolvers';
import { HttpRequest } from '../../types';
import { HeaderVersionOptions, MediaTypeVersionOptions, UriVersionOptions } from '../../plugin/http-plugin-options';

describe('HeaderVersionResolver', () => {
    let resolver: HeaderVersionResolver;

    beforeEach(() => {
        resolver = new HeaderVersionResolver();
    });

    it('should resolve the version from the configured header', () => {
        const request = {
            headers: {
                'x-api-version': '1'
            }
        } as unknown as HttpRequest;

        const options = {
            header: 'X-API-Version'
        } as HeaderVersionOptions;

        expect(resolver.resolve(request, options)).toBe('1');
    });

    it('should resolve the version using a lowercase header name', () => {
        const request = {
            headers: {
                'x-api-version': '2'
            }
        } as unknown as HttpRequest;

        const options = {
            header: 'X-API-VERSION'
        } as HeaderVersionOptions;

        expect(resolver.resolve(request, options)).toBe('2');
    });

    it('should return undefined when the header does not exist', () => {
        const request = {
            headers: {}
        } as unknown as HttpRequest;

        const options = {
            header: 'X-API-Version'
        } as HeaderVersionOptions;

        expect(resolver.resolve(request, options)).toBeUndefined();
    });
});

describe('MediaTypeVersionResolver', () => {
    let resolver: MediaTypeVersionResolver;

    beforeEach(() => {
        resolver = new MediaTypeVersionResolver();
    });

    it('should resolve the version from the content type', () => {
        const request = {
            getHeader: jest.fn().mockReturnValue('application/json+version=1')
        } as unknown as HttpRequest;

        const options = {
            key: 'version'
        } as MediaTypeVersionOptions;

        expect(resolver.resolve(request, options)).toBe('1');
        expect(request.getHeader).toHaveBeenCalledWith('content-type');
    });

    it('should resolve the version when content type contains parameters', () => {
        const request = {
            getHeader: jest.fn().mockReturnValue('application/json+version=2; charset=utf-8')
        } as unknown as HttpRequest;

        const options = {
            key: 'version'
        } as MediaTypeVersionOptions;

        expect(resolver.resolve(request, options)).toBe('2');
    });

    it('should resolve a custom version key', () => {
        const request = {
            getHeader: jest.fn().mockReturnValue('application/json+apiVersion=3')
        } as unknown as HttpRequest;

        const options = {
            key: 'apiVersion'
        } as MediaTypeVersionOptions;

        expect(resolver.resolve(request, options)).toBe('3');
    });

    it('should return undefined when content-type is not defined', () => {
        const request = {
            getHeader: jest.fn().mockReturnValue(undefined)
        } as unknown as HttpRequest;

        const options = {
            key: 'version'
        } as MediaTypeVersionOptions;

        expect(resolver.resolve(request, options)).toBeUndefined();
    });

    it('should return undefined when content-type is not a string', () => {
        const request = {
            getHeader: jest.fn().mockReturnValue(null)
        } as unknown as HttpRequest;

        const options = {
            key: 'version'
        } as MediaTypeVersionOptions;

        expect(resolver.resolve(request, options)).toBeUndefined();
    });

    it('should return undefined when the media type does not contain a version', () => {
        const request = {
            getHeader: jest.fn().mockReturnValue('application/json')
        } as unknown as HttpRequest;

        const options = {
            key: 'version'
        } as MediaTypeVersionOptions;

        expect(resolver.resolve(request, options)).toBeUndefined();
    });

    it('should return undefined when the configured key does not exist', () => {
        const request = {
            getHeader: jest.fn().mockReturnValue('application/json+version=1')
        } as unknown as HttpRequest;

        const options = {
            key: 'apiVersion'
        } as MediaTypeVersionOptions;

        expect(resolver.resolve(request, options)).toBeUndefined();
    });
});

describe('UriVersionResolver', () => {
    let resolver: UriVersionResolver;

    beforeEach(() => {
        resolver = new UriVersionResolver();
    });

    it('should resolve the version from the URI params', () => {
        const request = {
            params: {
                version: '1'
            }
        } as unknown as HttpRequest;

        const options = {} as UriVersionOptions;

        expect(resolver.resolve(request, options)).toBe('1');
    });

    it('should return undefined when the version parameter does not exist', () => {
        const request = {
            params: {}
        } as unknown as HttpRequest;

        const options = {} as UriVersionOptions;

        expect(resolver.resolve(request, options)).toBeUndefined();
    });
});
