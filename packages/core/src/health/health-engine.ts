import { Injectable } from '@axisparkjs/di';
import { PluginRegistry } from '../plugin';
import { HealthData } from './health-data';
import { PluginLifecycle, Plugin } from '../plugin/plugin';
import { AxiSparkConfig } from '../axispark/axispark-config';
import { HealthStatus } from './health-status';

/**
 * A class for managing and checking the health of the application and its plugins. It provides methods to check the health status of all registered plugins and the overall application health. The health status is represented using the `HealthData` interface, which includes information about each component's health, such as its name, current status, timestamp, and optional details. The class uses the `PluginRegistry` to access all registered plugins and determine their health based on their lifecycle state.
 *
 * Methods:
 * - `checkAll()`: Checks the health status of all registered plugins and returns an array of `HealthData` objects representing the health of each component, including the overall application health.
 * - `checkApp()`: Checks the overall health status of the application and returns a single `HealthData` object representing the application's health.
 * - `mapPluginStateToHealthData(pluginState: PluginLifecycle | undefined)`: A private method that maps a plugin's lifecycle state to a corresponding `HealthStatus` value, allowing for standardized representation of plugin health.
 *
 * The `HealthEngine` class is designed to be used in applications that require monitoring and reporting of component health, providing a structured way to assess the state of the application and its plugins.
 */
@Injectable()
export class HealthEngine {
    constructor(
        private readonly config: AxiSparkConfig,
        private readonly plugins: PluginRegistry
    ) {}

    /**
     * Checks the health status of all registered plugins and returns an array of `HealthData` objects representing the health of each component, including the overall application health. The method iterates through all registered plugins, retrieves their lifecycle state, and maps it to a corresponding `HealthStatus`. It also constructs an overall application health status based on the individual plugin statuses.
     * @returns An array of `HealthData` objects representing the health status of each component, including the overall application health.
     */
    public checkAll(): HealthData[] {
        const healthDatas: HealthData[] = this.plugins.getAll().map(({ type, instance }) => {
            return {
                component: type.name,
                timestamp: new Date().toISOString(),
                status: this.mapPluginStateToHealthData((instance as Plugin).getState()),
                details: {
                    plugin: type.name,
                    error: (instance as Plugin).getStateError()?.message
                }
            };
        });
        const unhealthyPluginPresence = healthDatas.some((state) => state.status === HealthStatus.Unhealthy);
        const statusOverall = unhealthyPluginPresence ? HealthStatus.Unhealthy : HealthStatus.Unknown;
        const appState: HealthData = {
            component: this.config.name as string,
            timestamp: new Date().toISOString(),
            status: healthDatas.every((state) => state.status === HealthStatus.Healthy) ? HealthStatus.Healthy : statusOverall,
            details: {
                plugins: healthDatas.map((state) => ({
                    component: state.component,
                    status: state.status
                }))
            }
        };
        healthDatas.unshift(appState);
        return healthDatas;
    }

    /**
     * Checks the health status of the application and returns a `HealthData` object representing the overall application health.
     * @returns A `HealthData` object representing the overall application health.
     */
    public checkApp(): HealthData {
        const healthDatas = this.checkAll();
        return healthDatas[0];
    }

    private mapPluginStateToHealthData(pluginState: PluginLifecycle | undefined): HealthStatus {
        switch (pluginState) {
            case PluginLifecycle.Created:
            case PluginLifecycle.Registered:
            case PluginLifecycle.Stopped:
                return HealthStatus.Unknown;
            case PluginLifecycle.Started:
                return HealthStatus.Healthy;
            case PluginLifecycle.Error:
                return HealthStatus.Unhealthy;
            default:
                return HealthStatus.Unhealthy;
        }
    }
}
