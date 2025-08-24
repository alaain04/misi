import { ConditionalExcept } from 'type-fest';

export type JustProps<T> = ConditionalExcept<T, Function>;

// This value object is a base class for Objects and not for primitives
export abstract class ValueObject {
  protected constructor(data: JustProps<ValueObject>) {
    Object.assign(this, data);
  }

  hasValue(): boolean {
     
    const v = Object.values(this).find((value: unknown) => value !== undefined);

    return Boolean(v);
  }
}
