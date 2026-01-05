import { DomainError } from './DomainError';

export class InvalidGHGIntensityError extends DomainError {
  constructor(value: number) {
    super(`GHG intensity must be non-negative. Received: ${value}`);
  }
}
