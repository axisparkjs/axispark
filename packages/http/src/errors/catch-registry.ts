import { CatchEntry } from './catch-entry';

export class CatchRegistry {
    private readonly catchs: CatchEntry[] = [];

    registerCatchs(catchs: CatchEntry[]): void {
        this.catchs.push(...catchs);
    }

    registerCatch(c: CatchEntry): void {
        this.catchs.push(c);
    }

    getCatchs(): readonly CatchEntry[] {
        return this.catchs;
    }
}
