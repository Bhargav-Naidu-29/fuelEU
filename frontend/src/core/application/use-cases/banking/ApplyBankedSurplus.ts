import { BankingPort } from '@/core/ports';

export class ApplyBankedSurplus {
    constructor(private readonly bankingPort: BankingPort) { }

    async execute(shipId: string, year: number, amount: number): Promise<void> {
        await this.bankingPort.applyBankedSurplus(shipId, year, amount);
    }
}
