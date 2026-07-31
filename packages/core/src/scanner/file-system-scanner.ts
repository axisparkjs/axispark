import { Scanner } from './scanner';
import fg from 'fast-glob';

export class FileSystemScanner implements Scanner {
    constructor(private readonly root = process.cwd()) {}

    public async scan(): Promise<void> {
        const files = await fg(['**/*.{js,ts}'], {
            cwd: this.root,
            absolute: true,
            ignore: [   
                '**/node_modules/**',
                '**/dist/**',
                '**/index.bootstrap.ts',
                '**/index.bootstrap.js',
                '**/*.d.ts',
                '**/*.spec.ts',
                '**/*.spec.js',
            ],
        });

        await Promise.all(
            files.map(file => import(file))
        );
    }
}
