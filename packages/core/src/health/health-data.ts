import { HealthStatus } from './health-status';

/**
 * An interface representing the health data for a component. It defines properties that describe the component's health status, including the component name, its current health status, a timestamp indicating when the health data was recorded, and optional details providing additional information about the component's health.
 * Properties:
 * - `component`: A string representing the name of the component for which the health data is being recorded.
 * - `status`: An enumeration value of type `HealthStatus` indicating the current health status of the component (e.g., healthy, degraded, unhealthy).
 * - `timestamp`: A string representing the timestamp when the health data was recorded, typically in ISO 8601 format.
 * - `details`: An optional object containing additional details about the component's health, which can include any relevant information or metrics that provide context to the health status.
 */
export interface HealthData {
    /**
     * A string representing the name of the component for which the health data is being recorded. This property is used to identify the specific component whose health status is being reported.
     */
    component: string;

    /**
     * An enumeration value of type `HealthStatus` indicating the current health status of the component. This property provides a standardized way to represent the health state of the component, such as healthy, degraded, or unhealthy.
     */
    status: HealthStatus;

    /**
     * A string representing the timestamp when the health data was recorded. This property is typically formatted in ISO 8601 format and provides a temporal context for the health status being reported.
     */
    timestamp: string;

    /**
     * An optional object containing additional details about the component's health. This property can include any relevant information or metrics that provide context to the health status, such as error messages, performance metrics, or other diagnostic information.
     */
    details?: Record<string, any>;
}
