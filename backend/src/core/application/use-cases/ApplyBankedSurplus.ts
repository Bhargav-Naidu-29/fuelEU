import { ComplianceBalance } from '../../domain/entities/ComplianceBalance';
import { BankingRepository } from '../../ports/outbound/BankingRepository';

export class ApplyBankedSurplus {
  constructor(
    private readonly repository: BankingRepository
  ) {}

  async execute(params: {
    balance: ComplianceBalance;
    amount: number;
  }): Promise<void> {
    const { balance, amount } = params;

    if (!balance.isDeficit()) {
      throw new Error('Banked surplus can only be applied to a deficit');
    }

    const available = await this.repository.findTotalBankedForShip(
      balance.shipId,
      balance.year
    );

    if (amount > available) {
      throw new Error('Insufficient banked surplus available');
    }

    await this.repository.applyBankedAmount(
      balance.shipId,
      balance.year,
      amount
    );
  }
}
