import { Context } from '@axisparkjs/engine';
import { HttpContext } from '../../types';
import { BadRequestError } from '../errors';
import { Guard } from '@axisparkjs/engine';
import { Check } from '@axisparkjs/engine';

@Guard()
export class VersionGuard {
    @Check()
    public async failedCheckVersion(@Context() context: HttpContext) {
        if (context.version && !context.version.isVersionAccepted())
            throw new BadRequestError(`Invalid version requested for ${context.request.method} ${context.request.path}`);
    }
}
