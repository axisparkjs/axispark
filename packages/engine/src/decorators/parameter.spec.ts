import { Metadata, MetadataKeys } from '@axisparkjs/common';
import { Parameter } from './parameter';

jest.mock('@axisparkjs/common', () => ({
    Metadata: {
        get: jest.fn(),
        define: jest.fn(),
        normalizeTarget: jest.fn((target) => target)
    },
    MetadataKeys: {
        PARAMETER: 'PARAMETER'
    }
}));

describe('Parameter', () => {
    const TestParameterName = 'test';
    const TestParameter = (field?: string) => Parameter(TestParameterName, field);

    beforeEach(() => {
        jest.clearAllMocks();
        (Metadata.get as jest.Mock).mockReturnValue([]);
    });

    it('should register parameter metadata', () => {
        (Metadata.get as jest.Mock).mockReturnValue(undefined);

        class Controller {
            method(@TestParameter('id') _value: unknown) {}
        }

        expect(Metadata.get).toHaveBeenCalledWith(MetadataKeys.PARAMETER, Controller.prototype, 'method');

        expect(Metadata.define).toHaveBeenCalledWith(
            MetadataKeys.PARAMETER,
            [
                {
                    parameter: TestParameterName,
                    field: 'id',
                    parameterIndex: 0,
                    propertyKey: 'method',
                    target: Controller.prototype
                }
            ],
            Controller.prototype,
            'method'
        );
    });

    it('should register metadata without field', () => {
        class Controller {
            method(@TestParameter() _value: unknown) {}
        }

        expect(Metadata.define).toHaveBeenCalledWith(
            MetadataKeys.PARAMETER,
            [
                {
                    parameter: TestParameterName,
                    field: undefined,
                    parameterIndex: 0,
                    propertyKey: 'method',
                    target: Controller.prototype
                }
            ],
            Controller.prototype,
            'method'
        );
    });

    it('should append existing metadata', () => {
        (Metadata.get as jest.Mock).mockReturnValue([
            {
                parameter: 'existing',
                field: 'foo',
                parameterIndex: 0,
                propertyKey: 'method',
                target: {}
            }
        ]);

        class Controller {
            method(_first: string, @TestParameter('id') _second: unknown) {}
        }

        expect(Metadata.define).toHaveBeenCalledWith(
            MetadataKeys.PARAMETER,
            [
                {
                    parameter: 'existing',
                    field: 'foo',
                    parameterIndex: 0,
                    propertyKey: 'method',
                    target: {}
                },
                {
                    parameter: TestParameterName,
                    field: 'id',
                    parameterIndex: 1,
                    propertyKey: 'method',
                    target: Controller.prototype
                }
            ],
            Controller.prototype,
            'method'
        );
    });

    it('should store the correct parameter parameterIndex', () => {
        class Controller {
            method(_first: string, @TestParameter() _second: unknown, _third: string) {}
        }

        expect(Metadata.define).toHaveBeenCalledWith(
            MetadataKeys.PARAMETER,
            [
                expect.objectContaining({
                    parameterIndex: 1
                })
            ],
            Controller.prototype,
            'method'
        );
    });
});
