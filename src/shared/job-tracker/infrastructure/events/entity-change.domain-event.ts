import { RuntimeError } from "@libs/errors";
import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { EntityChangeEvent } from "@shared/job-tracker/domain/events/entity-change.interface";
import { EntityChangePayload } from "@shared/job-tracker/domain/events/entity-change.type";

@Injectable()
export class EntityChangeDomainEvent implements EntityChangeEvent {
  constructor(private eventEmitter: EventEmitter2) { }

  emit(event: string, payload: EntityChangePayload): void {
    if (!event) {
      throw new RuntimeError("Event name not defined");
    }

    this.eventEmitter.emit(event, payload);
  }
}
