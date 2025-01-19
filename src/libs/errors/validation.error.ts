import { BaseError } from './error.abstract';

type ConstraintType =
  | 'number'
  | 'string'
  | 'date'
  | 'array'
  | 'boolean'
  | 'object'
  | 'email';

export type Constraints = {
  // field is required
  required?: boolean;
  // min value or min array size
  min?: number;
  // after date
  after?: string;
  // max value or min array size
  max?: number;
  // field type
  type?: ConstraintType;
  // field format (regex)
  format?: string;
  // exists (in database)
  exists?: boolean;
  // is unique (in database, aka: not exists)
  unique?: boolean;
  // one of values
  in?: unknown[];
  // excluded by other field
  excluded?: string;
  // valid range
  range?: boolean;
  // date is in the past
  past?: boolean;
  // custom message
  text?: string;
  // field is allowed to contain overlapping values. Useful for arrays of ranges from-to, min-max, etc.
  overlap?: boolean;
};

export type FailedConstraints = Record<string, Constraints>;

export class ValidationError extends BaseError {
  constructor(
    readonly constraints: FailedConstraints,
    message = 'Some fields contain errors. See `details` for information about failed constraints.',
  ) {
    super(message);
  }

  getFailedConstraints(): FailedConstraints {
    return this.constraints;
  }
}
