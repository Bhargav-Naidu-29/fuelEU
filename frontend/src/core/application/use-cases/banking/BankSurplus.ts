import { BankingPort } from '@/core/ports';

export class BankSurplus {
    constructor(private readonly bankingPort: BankingPort) { }

    async execute(shipId: string, year: number): Promise<void> {
        await this.bankingPort.bankSurplus(shipId, year);
    }
}
