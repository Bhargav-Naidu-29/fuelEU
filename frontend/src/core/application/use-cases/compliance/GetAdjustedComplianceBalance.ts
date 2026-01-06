import { CompliancePort } from '@/core/ports';
import { AdjustedComplianceBalance } from '@/core/domain';

export class GetAdjustedComplianceBalance {
    constructor(private readonly compliancePort: CompliancePort) { }

    async execute(shipId: string, year: number): Promise<AdjustedComplianceBalance> {
        return await this.compliancePort.getAdjustedComplianceBalance(shipId, year);
    }
}
