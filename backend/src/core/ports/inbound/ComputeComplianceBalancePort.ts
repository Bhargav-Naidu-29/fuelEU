import { Route } from '../../domain/entities/Route';
import { ComplianceBalance } from '../../domain/entities/ComplianceBalance';

export interface ComputeComplianceBalancePort {
  execute(route: Route): ComplianceBalance;
}
