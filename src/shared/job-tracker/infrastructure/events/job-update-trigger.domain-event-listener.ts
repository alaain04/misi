import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { EntityChangePayload } from "@shared/job-tracker/domain/events/entity-change.type";
import { PrismaService } from "@shared/database/prisma.service";
import { JobSqlService } from "../adapters";

@Injectable()
export class EntityChangeDomainEventListener {
  private readonly logger = new Logger(EntityChangeDomainEventListener.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jobSqlService: JobSqlService
  ) { }

  @OnEvent("events.job-status-update", { async: true, promisify: true })
  async handleChangeEvent(payload: EntityChangePayload): Promise<void> {
    this.logger.log(`Handling job status update event: ${JSON.stringify(payload)}`);

    if (payload.getJobUuid() && payload.getDependencyUuid()) {
      await this.jobSqlService.updateJobDependency(
        payload.getJobUuid(),
        payload.getDependencyUuid(),
        payload.getJobDependencyCmd()
      );

      await this.callUpdateJobAndDependencyStatus(payload.getJobUuid(), payload.getDependencyUuid());
    }
  }

  private async callUpdateJobAndDependencyStatus(jobUuid: string, dependencyUuid: string): Promise<void> {
    await this.prisma.$executeRawUnsafe(
      `CALL update_job_and_dependency_status($1, $2);`,
      jobUuid,
      dependencyUuid
    );
    this.logger.log(`Called update_job_and_dependency_status with jobUuid=${jobUuid}, dependencyUuid=${dependencyUuid}`);
  }
}
