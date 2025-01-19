import { BaseError } from './error.abstract';

export class NotFoundError extends BaseError {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}
