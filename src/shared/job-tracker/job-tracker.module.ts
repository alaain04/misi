import { Module } from '@nestjs/common';
import { JOB_SERVICE } from './domain/ports/job.repository';
import { JobSqlService } from './infrastructure/adapters/job.sql.service';
import { DependencyModule } from '@shared/dependency';

@Module({
  imports: [DependencyModule],
  controllers: [],
  providers: [
    {
      provide: JOB_SERVICE,
      useClass: JobSqlService,
    },
  ],
  exports: [
    {
      provide: JOB_SERVICE,
      useClass: JobSqlService,
    },
  ],
})
export class JobTrackerModule {}
