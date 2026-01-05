import { BankedSurplus } from '../../domain/entities/BankedSurplus';
import { Year } from '../../domain/value-objects/Year';

export interface BankRecord {
  id: string;
  shipId: string;
  year: number;
  amountGco2eq: number;
}


export interface BankingRepository {

  save(surplus: BankedSurplus): Promise<void>;

  findTotalBankedForShip(shipId: string, year: Year): Promise<number>;

  applyBankedAmount(shipId: string, year: Year, amount: number): Promise<void>;

  findRecordsByShipAndYear(shipId: string, year: Year): Promise<BankRecord[]>;
}

