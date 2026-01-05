import { ComplianceBalance } from '../../domain/entities/ComplianceBalance';
import { BankedSurplus } from '../../domain/entities/BankedSurplus';
import { BankingRepository } from '../../ports/outbound/BankingRepository';

export class BankSurplus {
  constructor(private readonly repository: BankingRepository) {}

  async execute(params: {
    balance: ComplianceBalance;
    amount: number;
  }): Promise<void> {
    const { balance, amount } = params;

    if (!balance.isSurplus()) {
      throw new Error('Cannot bank a non-positive compliance balance');
    }

    if (amount > balance.value) {
      throw new Error('Cannot bank more than available compliance balance');
    }

    const surplus = new BankedSurplus({
      shipId: balance.shipId,
      year: balance.year,
      amount,
    });

    await this.repository.save(surplus);
  }
}
