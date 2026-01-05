import { DomainError } from './DomainError';

export class InvalidYearError extends DomainError {
  constructor(value: number) {
    super(`Invalid year value: ${value}`);
  }
}
