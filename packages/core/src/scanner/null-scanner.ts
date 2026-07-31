import { Scanner } from './scanner';

export class NullScanner implements Scanner {
    public async scan(): Promise<void> {
        /* empty */
    }
}
