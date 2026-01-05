import { DomainError } from './DomainError';

export class InvalidComplianceValueError extends DomainError {
  constructor() {
    super('Compliance value could not be computed');
  }
}
