/**
 * Represents the health status of a component or system. The `HealthStatus` enum defines three possible states: `Unknown`, `Healthy`, and `Unhealthy`. This enumeration is used to indicate the current health condition of a component, allowing for standardized representation and communication of health information across different parts of the application.
 * 
 * - `Unknown`: Indicates that the health status of the component is not known or has not been determined. This state may be used when the health check has not been performed or when the result is inconclusive.
 * - `Healthy`: Indicates that the component is functioning properly and is in a good state. This status suggests that the component is operating as expected without any issues.
 * - `Unhealthy`: Indicates that the component is experiencing problems or is not functioning correctly. This status suggests that there are issues that need to be addressed to restore proper operation.
 */
export enum HealthStatus {
    Unknown = 'unknown',
    Healthy = 'healthy',
    Unhealthy = 'unhealthy'
}
