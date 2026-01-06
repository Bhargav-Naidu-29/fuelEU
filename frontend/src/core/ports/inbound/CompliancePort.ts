import {
  ComplianceBalance,
  AdjustedComplianceBalance,
} from '@/core/domain';

export interface CompliancePort {
  getComplianceBalance(
    shipId: string,
    year: number
  ): Promise<ComplianceBalance>;

  getAdjustedComplianceBalance(
    shipId: string,
    year: number
  ): Promise<AdjustedComplianceBalance>;
}
