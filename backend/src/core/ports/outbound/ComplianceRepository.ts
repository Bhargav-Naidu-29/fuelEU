import { ComplianceBalance } from '../../domain/entities/ComplianceBalance';

export interface ComplianceRepository {
  save(balance: ComplianceBalance): Promise<void>;
  findByShipAndYear(
    shipId: string,
    year: number,
  ): Promise<ComplianceBalance | null>;
}
