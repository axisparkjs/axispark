/**
 * A class representing a timeout definition.
 * It encapsulates the timeout duration in milliseconds.
 * This class is used to define the timeout behavior for a specific execution context or step.
 */
export class TimeoutDefinition {
    constructor(public readonly time: number) {}
}
