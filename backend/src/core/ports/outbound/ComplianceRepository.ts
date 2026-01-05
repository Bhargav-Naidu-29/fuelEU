import { Year } from '../../domain/value-objects/Year';
import { ComplianceBalance } from '../../domain/entities/ComplianceBalance';

export interface ComplianceRepository {
  save(balance: ComplianceBalance): Promise<void>;

  findByShipAndYear(
    shipId: string,
    year: Year,
  ): Promise<ComplianceBalance | null>;
}
