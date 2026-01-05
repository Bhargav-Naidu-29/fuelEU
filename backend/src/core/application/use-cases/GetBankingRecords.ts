import { BankingRepository, BankRecord } from '../../ports/outbound/BankingRepository';
import { Year } from '../../domain/value-objects/Year';

export class GetBankingRecords {
    constructor(private readonly repository: BankingRepository) { }

    async execute(shipId: string, year: Year): Promise<BankRecord[]> {
        return this.repository.findRecordsByShipAndYear(shipId, year);
    }
}
