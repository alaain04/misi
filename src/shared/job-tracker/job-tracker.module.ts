import { Module } from '@nestjs/common';
import { JOB_SERVICE } from './domain/ports/job.repository';
import { JobSqlService } from './infrastructure/adapters/job.sql.service';
import { DependencyModule } from '@shared/dependency';
import { EntityChangeDomainEvent } from './infrastructure/events/entity-change.domain-event';
import { ENTITY_CHANGE_EVENT } from './domain/events/entity-change.interface';
import { EntityChangeDomainEventListener } from './infrastructure/events/job-update-trigger.domain-event-listener';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrismaModule } from '@shared/database/prisma.module';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true,
    }),
    DependencyModule,
    PrismaModule
  ],
  controllers: [],
  providers: [
    JobSqlService,
    {
      provide: JOB_SERVICE,
      useClass: JobSqlService,
    },
    {
      provide: ENTITY_CHANGE_EVENT,
      useClass: EntityChangeDomainEvent
    },
    EntityChangeDomainEventListener
  ],
  exports: [
    {
      provide: JOB_SERVICE,
      useClass: JobSqlService,
    },
    {
      provide: ENTITY_CHANGE_EVENT,
      useClass: EntityChangeDomainEvent
    }
  ],
})
export class JobTrackerModule { }
