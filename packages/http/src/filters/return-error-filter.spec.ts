import { ReturnErrorFilter } from './return-error-filter';
import { HttpError } from '../errors';
import { HttpResults } from '../execution-results/http-results';
import { HttpStatusCode } from '../types/http-status-code';

jest.mock('../execution-results/http-results', () => ({
    HttpResults: {
        Error: jest.fn()
    }
}));

describe('ReturnErrorFilter', () => {
    let filter: ReturnErrorFilter;

    beforeEach(() => {
        jest.clearAllMocks();
        filter = new ReturnErrorFilter();
    });

    it('should return the same HttpError', async () => {
        const error = new HttpError('Not Found', HttpStatusCode.NotFound);

        const expected = {} as any;
        (HttpResults.Error as jest.Mock).mockReturnValue(expected);

        const result = await filter.error(error);

        expect(HttpResults.Error).toHaveBeenCalledWith(error);
        expect(result).toBe(expected);
    });

    it('should wrap a generic Error into HttpError', async () => {
        const error = new Error('Boom');

        const expected = {} as any;
        (HttpResults.Error as jest.Mock).mockReturnValue(expected);

        const result = await filter.error(error);

        expect(HttpResults.Error).toHaveBeenCalledTimes(1);

        const httpError = (HttpResults.Error as jest.Mock).mock.calls[0][0];

        expect(httpError).toBeInstanceOf(HttpError);
        expect(httpError.message).toBe('Boom');
        expect(httpError.status).toBe(HttpStatusCode.InternalServerError);

        expect(result).toBe(expected);
    });
});
