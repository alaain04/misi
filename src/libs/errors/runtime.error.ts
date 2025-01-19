import { BaseError } from './error.abstract';

export class RuntimeError extends BaseError {
  constructor(message = 'Runtime Error') {
    super(message);
  }
}
