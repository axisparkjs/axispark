import { Scanner } from './scanner';
import fg from 'fast-glob';

/**
 * A scanner implementation that scans the file system for JavaScript and TypeScript files. The `FileSystemScanner` class implements the `Scanner` interface and provides functionality to scan the file system starting from a specified root directory. It uses the `fast-glob` library to perform file matching based on specified patterns, allowing for efficient scanning of files while ignoring certain directories and file types.
 *
 * The `FileSystemScanner` class has a constructor that accepts two optional parameters: `root`, which specifies the root directory to start scanning from (defaulting to the current working directory), and `importer`, which is a function used to import the discovered files (defaulting to dynamic import). The `scan` method initiates the scanning process, retrieves the matching files, and imports them using the provided importer function.
 */
export class FileSystemScanner implements Scanner {
    constructor(
        private readonly root = process.cwd(),
        private readonly importer: (file: string) => Promise<unknown> = (file) => import(file)
    ) {}

    /**
     * Scans the file system for JavaScript and TypeScript files starting from the specified root directory.
     */
    public async scan(): Promise<void> {
        const files = await fg(['**/*.{js,ts}'], {
            cwd: this.root,
            absolute: true,
            ignore: ['**/node_modules/**', '**/dist/**', '**/index.bootstrap.ts', '**/index.bootstrap.js', '**/*.d.ts', '**/*.spec.ts', '**/*.spec.js']
        });

        await Promise.all(files.map((file) => this.importer(file)));
    }
}
