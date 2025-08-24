import { EntityChangePayload } from "./entity-change.type";

export const ENTITY_CHANGE_EVENT = Symbol("ENTITY_CHANGE_EVENT");

export interface EntityChangeEvent {
  emit(event: string, payload: EntityChangePayload): void;
}
