export abstract class ResourceListResponse<T> {
  constructor(readonly data: T[]) {}
}
