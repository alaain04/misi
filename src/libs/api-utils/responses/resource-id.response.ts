import { ResourceSingleResponse } from './resource-single.response';

class Id {
  id: string;
}

export class ResourceIdResponse extends ResourceSingleResponse<Id> {
  constructor(id: string) {
    super({ id });
  }
}
