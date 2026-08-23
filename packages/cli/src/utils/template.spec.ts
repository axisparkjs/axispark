import { mkdir, rm, cp, mkdtemp } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import tar from 'tar';
import { downloadTemplate } from './template';

jest.mock('node:fs/promises', () => ({
    mkdir: jest.fn(),
    rm: jest.fn(),
    cp: jest.fn(),
    mkdtemp: jest.fn(),
}));

jest.mock('node:fs', () => ({
    createWriteStream: jest.fn(),
}));

jest.mock('node:stream', () => ({
    Readable: {
        fromWeb: jest.fn(),
    },
}));

jest.mock('node:stream/promises', () => ({
    pipeline: jest.fn(),
}));

jest.mock('tar', () => ({
    __esModule: true,
    default: {
        x: jest.fn(),
    },
}));

const mockedMkdtemp = mkdtemp as jest.MockedFunction<typeof mkdtemp>;
const mockedMkdir = mkdir as jest.MockedFunction<typeof mkdir>;
const mockedRm = rm as jest.MockedFunction<typeof rm>;
const mockedCp = cp as jest.MockedFunction<typeof cp>;

const mockedCreateWriteStream =
    createWriteStream as jest.MockedFunction<typeof createWriteStream>;

const mockedFromWeb =
    Readable.fromWeb as jest.MockedFunction<typeof Readable.fromWeb>;

const mockedPipeline =
    pipeline as jest.MockedFunction<typeof pipeline>;

const mockedTarX =
    tar.x as jest.MockedFunction<typeof tar.x>;

describe('downloadTemplate', () => {
    const tempDirectory = '/tmp/axispark-test';

    beforeEach(() => {
        jest.clearAllMocks();

        mockedMkdtemp.mockResolvedValue(tempDirectory);
        mockedMkdir.mockResolvedValue(undefined);
        mockedRm.mockResolvedValue(undefined);
        mockedCp.mockResolvedValue(undefined);
        mockedPipeline.mockResolvedValue(undefined);
        mockedTarX.mockResolvedValue(undefined as any);

        mockedFromWeb.mockReturnValue({} as any);

        mockedCreateWriteStream.mockReturnValue({} as any);
    });

    it('downloads and extracts the template', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            body: {},
        });

        await downloadTemplate(
            'basic',
            '/projects/my-project',
        );

        expect(global.fetch).toHaveBeenCalledWith(
            'https://github.com/axispark/axisparkjs/archive/refs/heads/main.tar.gz',
        );

        expect(mockedFromWeb).toHaveBeenCalledWith({});

        expect(mockedPipeline).toHaveBeenCalled();

        expect(mockedMkdir).toHaveBeenCalledWith(
            '/tmp/axispark-test/extracted',
        );

        expect(mockedTarX).toHaveBeenCalledWith({
            file: '/tmp/axispark-test/templates.tar.gz',
            cwd: '/tmp/axispark-test/extracted',
        });

        expect(mockedCp).toHaveBeenCalledWith(
            '/tmp/axispark-test/extracted/templates-main/basic',
            '/projects/my-project',
            {
                recursive: true,
            },
        );
    });

    it('removes the temporary directory after success', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            body: {},
        });

        await downloadTemplate(
            'basic',
            '/projects/my-project',
        );

        expect(mockedRm).toHaveBeenCalledWith(
            '/tmp/axispark-test',
            {
                recursive: true,
                force: true,
            },
        );
    });

    it('throws when the response is not ok', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: false,
            status: 404,
            body: {},
        });

        await expect(
            downloadTemplate(
                'basic',
                '/projects/my-project',
            ),
        ).rejects.toThrow(
            'Failed to download templates: 404',
        );

        expect(mockedPipeline).not.toHaveBeenCalled();
        expect(mockedCp).not.toHaveBeenCalled();
    });

    it('throws when the response has no body', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            body: null,
        });

        await expect(
            downloadTemplate(
                'basic',
                '/projects/my-project',
            ),
        ).rejects.toThrow(
            'Failed to download templates: 200',
        );

        expect(mockedPipeline).not.toHaveBeenCalled();
    });

    it('removes temporary directory when an error occurs', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            body: {},
        });

        mockedTarX.mockRejectedValueOnce(
            new Error('Extraction failed'),
        );

        await expect(
            downloadTemplate(
                'basic',
                '/projects/my-project',
            ),
        ).rejects.toThrow('Extraction failed');

        expect(mockedRm).toHaveBeenCalledWith(
            '/tmp/axispark-test',
            {
                recursive: true,
                force: true,
            },
        );
    });
});