import { JobDependencyTrace } from "@shared/job-tracker";

export const REGISTRY_PRODUCER = Symbol('REGISTRY_PRODUCER');

export interface RegistryProducer {
  send(jobUuid: string, dependencyUuid: string, repositoryPath: string, target: JobDependencyTrace,): Promise<void>;
}