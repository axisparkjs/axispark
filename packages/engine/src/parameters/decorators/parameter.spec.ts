import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { Parameter } from './parameter';

jest.mock('@axisparkjs/common', () => ({
    Metadata: {
        getMethod: jest.fn(),
        defineMethod: jest.fn()
    },
    MetadataKeys: {
        PARAMETER: 'PARAMETER'
    }
}));

describe('Parameter', () => {
    const TestParameterName = 'test';
    const TestParameter = Parameter(TestParameterName);

    beforeEach(() => {
        jest.clearAllMocks();
        (Metadata.getMethod as jest.Mock).mockReturnValue([]);
    });

    it('should register parameter metadata', () => {
        (Metadata.getMethod as jest.Mock).mockReturnValue(undefined);

        class Controller {
            method(@TestParameter('id') _value: unknown) {}
        }

        expect(Metadata.getMethod).toHaveBeenCalledWith(MetadataKeys.PARAMETER, Controller.prototype, 'method');

        expect(Metadata.defineMethod).toHaveBeenCalledWith(
            MetadataKeys.PARAMETER,
            [
                {
                    parameter: TestParameterName,
                    name: 'id',
                    index: 0,
                    propertyKey: 'method',
                    target: Controller.prototype
                }
            ],
            Controller.prototype,
            'method'
        );
    });

    it('should register metadata without name', () => {
        class Controller {
            method(@TestParameter() _value: unknown) {}
        }

        expect(Metadata.defineMethod).toHaveBeenCalledWith(
            MetadataKeys.PARAMETER,
            [
                {
                    parameter: TestParameterName,
                    name: undefined,
                    index: 0,
                    propertyKey: 'method',
                    target: Controller.prototype
                }
            ],
            Controller.prototype,
            'method'
        );
    });

    it('should append existing metadata', () => {
        (Metadata.getMethod as jest.Mock).mockReturnValue([
            {
                parameter: 'existing',
                name: 'foo',
                index: 0,
                propertyKey: 'method',
                target: {}
            }
        ]);

        class Controller {
            method(_first: string, @TestParameter('id') _second: unknown) {}
        }

        expect(Metadata.defineMethod).toHaveBeenCalledWith(
            MetadataKeys.PARAMETER,
            [
                {
                    parameter: 'existing',
                    name: 'foo',
                    index: 0,
                    propertyKey: 'method',
                    target: {}
                },
                {
                    parameter: TestParameterName,
                    name: 'id',
                    index: 1,
                    propertyKey: 'method',
                    target: Controller.prototype
                }
            ],
            Controller.prototype,
            'method'
        );
    });

    it('should store the correct parameter index', () => {
        class Controller {
            method(_first: string, @TestParameter() _second: unknown, _third: string) {}
        }

        expect(Metadata.defineMethod).toHaveBeenCalledWith(
            MetadataKeys.PARAMETER,
            [
                expect.objectContaining({
                    index: 1
                })
            ],
            Controller.prototype,
            'method'
        );
    });
});
