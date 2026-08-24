/**
 * An enumeration representing the scope of a pipe in the execution context.
 * It defines the different levels at which a pipe can be applied, including parameter-level, method-level, and class-level scopes.
 */
export enum PipeScope {
    Parameter = 'parameter',
    Method = 'method',
    Class = 'class'
}
