import { ClassRegistry } from '@axisparkjs/di';
import { AxiSparkContext } from '@axisparkjs/core';
import { Generator, Metadata, MetadataKeys } from '@axisparkjs/common';
import { Job } from './job';
import { JobMetadata } from '../metadata';

class JobGeneratorStatic implements Generator<Promise<{ job: Job; disabled: boolean }[]>> {
    async generate(context: AxiSparkContext): Promise<{ job: Job; disabled: boolean }[]> {
        const schedulers = ClassRegistry.getWithMetadata(MetadataKeys.SCHEDULER);
        const jobs: { job: Job; disabled: boolean }[] = [];
        for (const scheduler of schedulers) {
            const jobsMetadata = Metadata.get<JobMetadata[]>(MetadataKeys.JOB, scheduler) ?? [];
            for (const jobMetadata of jobsMetadata) {
                const jobInstance = await context.container.resolve<any>(jobMetadata.target);
                const jobMethod = jobInstance[jobMetadata.propertyKey as keyof typeof jobInstance].bind(jobInstance);
                jobs.push({ job: Job.fromMetadata(jobMetadata, jobMethod), disabled: jobMetadata.disabled });
            }
        }
        return jobs;
    }
}
export const JobGenerator = new JobGeneratorStatic();
