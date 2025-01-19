import { ConditionalExcept } from 'type-fest';

// eslint-disable-next-line @typescript-eslint/ban-types
export type JustProps<T> = ConditionalExcept<T, Function>;

// This value object is a base class for Objects and not for primitives
export abstract class ValueObject {
  protected constructor(data: JustProps<ValueObject>) {
    Object.assign(this, data);
  }

  hasValue(): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const v = Object.values(this).find((value: unknown) => value !== undefined);

    return Boolean(v);
  }
}
