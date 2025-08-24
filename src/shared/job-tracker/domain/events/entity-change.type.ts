import { JustProps, ValueObject } from "@libs/entity";
import { JobDependencyStatus, JobDependencyTrace } from "@prisma/client";

export type JobDependencyCmd = {
  status?: JobDependencyStatus,
  trace: JobDependencyTrace,
  error?: string;
}

export class EntityChangePayload extends ValueObject {
  private jobUuid: string;
  private dependencyUuid: string;
  private jobDependencyCmd: JobDependencyCmd;

  public getJobUuid(): string {
    return this.jobUuid;
  }

  public getDependencyUuid(): string {
    return this.dependencyUuid;
  }

  public getJobDependencyCmd(): JobDependencyCmd {
    return this.jobDependencyCmd;
  }

  static build(data: JustProps<EntityChangePayload>): EntityChangePayload {
    return new EntityChangePayload(data);
  }
}