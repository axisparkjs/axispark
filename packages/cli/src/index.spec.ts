const addCommand = jest.fn();
const name = jest.fn().mockReturnThis();
const description = jest.fn().mockReturnThis();
const parseAsync = jest.fn();

const CommandMock = jest.fn(() => ({
    name,
    description,
    addCommand,
    parseAsync
}));

const createCommand = { name: 'create' };

jest.mock('commander', () => ({
    Command: CommandMock
}));

jest.mock('./commands/create', () => ({
    createCommand
}));

describe('CLI', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('debería configurar correctamente el programa y ejecutar parseAsync', async () => {
        await import('./index');

        expect(CommandMock).toHaveBeenCalledTimes(1);

        expect(name).toHaveBeenCalledWith('axispark');
        expect(description).toHaveBeenCalledWith('CLI for AxiSpark.js');
        expect(addCommand).toHaveBeenCalledWith(createCommand);
        expect(parseAsync).toHaveBeenCalledTimes(1);
    });
});
