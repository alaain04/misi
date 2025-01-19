const UPPER_CASE_REGEX = /[A-Z][a-z]+/g;

export abstract class BaseError extends Error {
  constructor(message: string) {
    super(message);

    this.name = this.constructor.name;
  }

  get code(): string {
    let obj: unknown = Object.getPrototypeOf(this);
    const classes: string[] = [];

    // Base Error is kinda redundant to add to the error code
    while (obj && obj.constructor.name !== 'BaseError') {
      classes.push(obj.constructor.name);
      obj = Object.getPrototypeOf(obj);
    }

    return classes.reverse().join('::');
  }

  public getTitle(): string {
    return (
      this.constructor.name.match(UPPER_CASE_REGEX)?.join(' ') ??
      this.constructor.name
    );
  }
}
