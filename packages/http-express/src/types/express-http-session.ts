import { HttpSession } from '@axisparkjs/http';
import { Session, SessionData } from 'express-session';

export class ExpressHttpSession<T extends object = Record<string, unknown>> implements HttpSession<T> {
    constructor(private readonly session: Session & Partial<SessionData>) {}

    get id() {
        return this.session.id;
    }

    get data(): Readonly<T> {
        return this.session as unknown as T;
    }

    get<K extends keyof T>(key: K): T[K] | undefined {
        return (this.session as any)[key];
    }

    set<K extends keyof T>(key: K, value: T[K]): void {
        (this.session as any)[key] = value;
    }

    has<K extends keyof T>(key: K): boolean {
        return key in this.session;
    }

    delete<K extends keyof T>(key: K): boolean {
        return delete (this.session as any)[key];
    }

    clear(): void {
        for (const key of Object.keys(this.session)) {
            if (key === 'cookie' || key === 'id' || key === 'save' || key === 'reload' || key === 'destroy' || key === 'regenerate' || key === 'touch') {
                continue;
            }

            delete (this.session as any)[key];
        }
    }

    save(): Promise<void> {
        return new Promise((resolve, reject) => this.session.save((err) => (err ? reject(err) : resolve())));
    }

    reload(): Promise<void> {
        return new Promise((resolve, reject) => this.session.reload((err) => (err ? reject(err) : resolve())));
    }

    regenerate(): Promise<void> {
        return new Promise((resolve, reject) => this.session.regenerate((err) => (err ? reject(err) : resolve())));
    }

    destroy(): Promise<void> {
        return new Promise((resolve, reject) => this.session.destroy((err) => (err ? reject(err) : resolve())));
    }

    async touch(): Promise<void> {
        this.session.touch();
    }
}
