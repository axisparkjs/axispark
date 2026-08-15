import { VersionGuard } from './version-guard';
import { HttpContext } from '../../types';
import { BadRequestError } from '../errors';

describe('VersionGuard', () => {
    let guard: VersionGuard;

    beforeEach(() => {
        guard = new VersionGuard();
    });

    it('should not throw when no version is provided', async () => {
        const context = {
            version: undefined,
            request: {
                method: 'GET',
                path: '/users'
            }
        } as HttpContext;

        await expect(
            guard.failedCheckVersion(context)
        ).resolves.toBeUndefined();
    });

    it('should not throw when the requested version is accepted', async () => {
        const context = {
            version: {
                isVersionAccepted: true
            },
            request: {
                method: 'GET',
                path: '/users'
            }
        } as any as HttpContext;

        await expect(
            guard.failedCheckVersion(context)
        ).resolves.toBeUndefined();
    });

    it('should throw BadRequestError when the requested version is not accepted', async () => {
        const context = {
            version: {
                isVersionAccepted: false
            },
            request: {
                method: 'GET',
                path: '/users'
            }
        } as any as HttpContext;

        await expect(
            guard.failedCheckVersion(context)
        ).rejects.toBeInstanceOf(BadRequestError);
    });

    it('should include the request method and path in the error message', async () => {
        const context = {
            version: {
                isVersionAccepted: false
            },
            request: {
                method: 'POST',
                path: '/users/123'
            }
        } as any as HttpContext;

        await expect(
            guard.failedCheckVersion(context)
        ).rejects.toThrow(
            'Invalid version requested for POST /users/123'
        );
    });

    it('should not throw when version exists but isVersionAccepted is truthy', async () => {
        const context = {
            version: {
                isVersionAccepted: true
            },
            request: {
                method: 'PATCH',
                path: '/users/123'
            }
        } as any as HttpContext;

        await expect(
            guard.failedCheckVersion(context)
        ).resolves.toBeUndefined();
    });
});