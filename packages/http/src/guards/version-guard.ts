import { Context } from "@axisparkjs/engine";
import { HttpContext } from "../types";
import { BadRequestError } from "../errors";
import { Injectable } from "@axisparkjs/di";

@Injectable()
export class VersionGuard {
    public async failedCheckVersion(@Context() context: HttpContext){
        throw new BadRequestError(`Invalid version requested for ${context.request.method} ${context.request.path}`);
    }
}