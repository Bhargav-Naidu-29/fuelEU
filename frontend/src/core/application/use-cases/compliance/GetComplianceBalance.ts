import { CompliancePort } from '@/core/ports';
import { ComplianceBalance } from '@/core/domain';

export class GetComplianceBalance {
    constructor(private readonly compliancePort: CompliancePort) { }

    async execute(shipId: string, year: number): Promise<ComplianceBalance> {
        return await this.compliancePort.getComplianceBalance(shipId, year);
    }
}
