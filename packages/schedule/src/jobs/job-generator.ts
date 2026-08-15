import { Generator, Metadata, MetadataKeys, ClassType, MethodType } from '@axisparkjs/common';
import { ClassRegistry, Injectable } from '@axisparkjs/di';
import { AxiSparkContext } from '@axisparkjs/core';
import { JobDefinition } from './job-definition';
import { JobMetadata } from '../metadata';

@Injectable()
export class JobGenerator implements Generator<Promise<JobDefinition[]>> {
    async generate(context: AxiSparkContext): Promise<JobDefinition[]> {
        const schedulers = ClassRegistry.getWithMetadata(MetadataKeys.SCHEDULER);
        const jobs: JobDefinition[] = [];

        for (const scheduler of schedulers) {
            const jobsMetadata = Metadata.get<JobMetadata[]>(MetadataKeys.JOB, scheduler) ?? [];

            for (const jobMetadata of jobsMetadata) {
                const jobInstance = await context.container.resolve<JobDefinition>(jobMetadata.target as ClassType<JobDefinition>);
                const jobMethod = (jobInstance[jobMetadata.propertyKey as keyof typeof jobInstance] as MethodType).bind(jobInstance);

                jobs.push(JobDefinition.fromMetadata(jobMetadata, jobMethod));
            }
        }
        return jobs;
    }
}
