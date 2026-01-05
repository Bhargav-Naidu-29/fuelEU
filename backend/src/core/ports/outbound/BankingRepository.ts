import { BankedSurplus } from '../../domain/entities/BankedSurplus';
import { Year } from '../../domain/value-objects/Year';

export interface BankingRepository {
  save(surplus: BankedSurplus): Promise<void>;

  findTotalBankedForShip(shipId: string, year: Year): Promise<number>;

  applyBankedAmount(shipId: string, year: Year, amount: number): Promise<void>;
}
