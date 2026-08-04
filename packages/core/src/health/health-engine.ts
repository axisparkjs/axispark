import { Injectable } from '@axisparkjs/di';
import { PluginRegistry } from '../plugin';
import { HealthData } from './health-data';
import { PluginLifecycle, Pluggable } from '../plugin/pluggable';
import { AxiSparkConfig } from '../axispark/axispark-config';
import { HealthStatus } from './health-status';

@Injectable()
export class HealthEngine {
    constructor(
        private readonly config: AxiSparkConfig,
        private readonly plugins: PluginRegistry
    ) {}

    public checkAll(): HealthData[] {
        const healthDatas: HealthData[] = this.plugins.getAll().map(({ type, instance }) => {
            return {
                component: type.name,
                timestamp: new Date().toISOString(),
                status: this.mapPluginStateToHealthData((instance as Pluggable).getState()),
                details: {
                    plugin: type.name,
                    error: (instance as Pluggable).getStateError()?.message
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
