import { PipeStep, PipeStepParsingError } from '../../pipe';
import { Injectable } from '@axisparkjs/di';
import { ParameterDefinition } from '../../parameter';

@Injectable()
export class ParseBooleanPipeStep implements PipeStep<string, boolean> {
    execute(parameter: ParameterDefinition): any {
        const value = parameter.value;
        if (typeof value === 'boolean') {
            return value;
        }

        if (typeof value === 'string') {
            switch (value.toLowerCase()) {
                case 'true':
                case '1':
                case 'yes':
                case 'on':
                    return true;

                case 'false':
                case '0':
                case 'no':
                case 'off':
                    return false;
            }
        }

        throw new PipeStepParsingError(parameter, `Value '${value}' is not a valid boolean.`, 'boolean');
    }
}

export const ParseBoolean = () => ParseBooleanPipeStep;
