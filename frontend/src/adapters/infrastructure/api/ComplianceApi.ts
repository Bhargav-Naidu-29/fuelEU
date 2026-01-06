import { CompliancePort } from '@/core/ports';
import {
    ComplianceBalance,
    AdjustedComplianceBalance,
} from '@/core/domain';
import { HttpClientPort } from '@/core/ports';

export class ComplianceApi implements CompliancePort {
    constructor(private readonly http: HttpClientPort) { }

    async getComplianceBalance(
        shipId: string,
        year: number
    ): Promise<ComplianceBalance> {
        const data = await this.http.get('/compliance/cb', {
            shipId,
            year,
        });

        return ComplianceBalance.fromApi(data);
    }

    async getAdjustedComplianceBalance(
        shipId: string,
        year: number
    ): Promise<AdjustedComplianceBalance> {
        const data = await this.http.get(
            '/compliance/adjusted-cb',
            { shipId, year }
        );

        return AdjustedComplianceBalance.fromApi(data);
    }
}
