import { Logger } from './logger';
import { LogLevel } from './log-level';
import { LogTransport, LogTransportOptions } from './log-transport';

class MockTransport extends LogTransport {
    write = jest.fn();
}

describe('Logger', () => {
    let transport1: MockTransport;
    let transport2: MockTransport;
    let logger: Logger;

    beforeEach(() => {
        const config: LogTransportOptions = {
            minLevel: LogLevel.INFO,
            formatter: {
                format: jest.fn().mockReturnValue('formatted message')
            }
        };
        transport1 = new MockTransport(config);
        transport2 = new MockTransport(config);
        logger = new Logger([transport1, transport2]);
    });

    describe('info', () => {
        it('should log an INFO entry', async () => {
            await logger.info('info message');

            expect(transport1.write).toHaveBeenCalledTimes(1);
            expect(transport2.write).toHaveBeenCalledTimes(1);

            expect(transport1.write).toHaveBeenCalledWith(
                expect.objectContaining({
                    level: LogLevel.INFO,
                    message: 'info message',
                    scopes: []
                })
            );

            expect(transport1.write.mock.calls[0][0].timestamp).toBeInstanceOf(Date);
        });
    });

    describe('warn', () => {
        it('should log a WARN entry', async () => {
            await logger.warn('warn message');

            expect(transport1.write).toHaveBeenCalledWith(
                expect.objectContaining({
                    level: LogLevel.WARN,
                    message: 'warn message',
                    scopes: []
                })
            );
        });
    });

    describe('debug', () => {
        it('should log a DEBUG entry', async () => {
            await logger.debug('debug message');

            expect(transport1.write).toHaveBeenCalledWith(
                expect.objectContaining({
                    level: LogLevel.DEBUG,
                    message: 'debug message',
                    scopes: []
                })
            );
        });
    });

    describe('trace', () => {
        it('should log a TRACE entry', async () => {
            await logger.trace('trace message');

            expect(transport1.write).toHaveBeenCalledWith(
                expect.objectContaining({
                    level: LogLevel.TRACE,
                    message: 'trace message',
                    scopes: []
                })
            );
        });
    });

    describe('error', () => {
        it('should log an ERROR entry', async () => {
            const error = new Error('boom');

            await logger.error('error message', error);

            expect(transport1.write).toHaveBeenCalledWith(
                expect.objectContaining({
                    level: LogLevel.ERROR,
                    message: 'error message',
                    error,
                    scopes: []
                })
            );
        });

        it('should allow logging without an error', async () => {
            await logger.error('error message');

            expect(transport1.write).toHaveBeenCalledWith(
                expect.objectContaining({
                    level: LogLevel.ERROR,
                    message: 'error message',
                    error: undefined
                })
            );
        });
    });

    describe('fatal', () => {
        it('should log a FATAL entry', async () => {
            const error = new Error('fatal');

            await logger.fatal('fatal message', error);

            expect(transport1.write).toHaveBeenCalledWith(
                expect.objectContaining({
                    level: LogLevel.FATAL,
                    message: 'fatal message',
                    error,
                    scopes: []
                })
            );
        });

        it('should allow logging without an error', async () => {
            await logger.fatal('fatal message');

            expect(transport1.write).toHaveBeenCalledWith(
                expect.objectContaining({
                    level: LogLevel.FATAL,
                    message: 'fatal message',
                    error: undefined
                })
            );
        });
    });

    describe('log', () => {
        it('should log metadata', async () => {
            const metadata = {
                id: 123,
                user: 'john'
            };

            await logger.log({
                level: LogLevel.INFO,
                message: 'message',
                metadata
            });

            expect(transport1.write).toHaveBeenCalledWith(
                expect.objectContaining({
                    level: LogLevel.INFO,
                    message: 'message',
                    metadata,
                    scopes: []
                })
            );
        });

        it('should send the log to every transport', async () => {
            await logger.log({
                level: LogLevel.INFO,
                message: 'message'
            });

            expect(transport1.write).toHaveBeenCalledTimes(1);
            expect(transport2.write).toHaveBeenCalledTimes(1);
        });

        it('should include a timestamp', async () => {
            await logger.log({
                level: LogLevel.INFO,
                message: 'message'
            });

            const entry = transport1.write.mock.calls[0][0];

            expect(entry.timestamp).toBeInstanceOf(Date);
        });
    });

    describe('child', () => {
        it('should create a child logger with one scope', async () => {
            const child = logger.child('service');

            await child.info('message');

            expect(transport1.write).toHaveBeenCalledWith(
                expect.objectContaining({
                    scopes: ['service']
                })
            );
        });

        it('should accumulate scopes', async () => {
            const child = logger.child('service').child('controller').child('method');

            await child.info('message');

            expect(transport1.write).toHaveBeenCalledWith(
                expect.objectContaining({
                    scopes: ['service', 'controller', 'method']
                })
            );
        });

        it('should not modify the parent logger scopes', async () => {
            const child = logger.child('service');

            await child.info('child');
            await logger.info('parent');

            expect(transport1.write.mock.calls[0][0].scopes).toEqual(['service']);

            expect(transport1.write.mock.calls[1][0].scopes).toEqual([]);
        });
    });
});
