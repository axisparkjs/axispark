import { HttpSession } from '@axisparkjs/http';
import { FastifySessionObject } from '@fastify/session';

export class FastifyHttpSession<T extends object = Record<string, unknown>> implements HttpSession<T> {
    constructor(private readonly session: FastifySessionObject) {
        if (!(this.session as any).data) {
            (this.session as any).data = {};
        }
    }

    get id(): string {
        return this.session.sessionId;
    }

    get data(): Readonly<T> {
        return (this.session as any)['data'] as unknown as Readonly<T>;
    }

    get<K extends keyof T>(key: K): T[K] | undefined {
        return (this.session as any)['data'][key];
    }

    set<K extends keyof T>(key: K, value: T[K]): void {
        (this.session as any)['data'][key] = value;
    }

    has<K extends keyof T>(key: K): boolean {
        return key in (this.session as any)['data'];
    }

    delete<K extends keyof T>(key: K): boolean {
        return delete (this.session as any)['data'][key];
    }

    clear(): void {
        for (const key of Object.keys((this.session as any)['data'])) {
            delete (this.session as any)['data'][key];
        }
    }

    save(): Promise<void> {
        return this.session.save();
    }

    reload(): Promise<void> {
        return this.session.regenerate().then(() => undefined);
    }

    regenerate(): Promise<void> {
        return this.session.regenerate();
    }

    destroy(): Promise<void> {
        return this.session.destroy();
    }

    async touch(): Promise<void> {
        this.session.touch();
    }
}
