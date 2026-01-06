import { BankingPort } from '@/core/ports';
import { BankRecord } from '@/core/domain';

export class GetBankingRecords {
    constructor(private readonly bankingPort: BankingPort) { }

    async execute(shipId: string, year: number): Promise<BankRecord[]> {
        return await this.bankingPort.getBankingRecords(shipId, year);
    }
}
