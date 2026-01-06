import { BankingRepository } from '@/core/ports/outbound/BankingRepository';
import { BankedSurplus } from '@/core/domain/entities/BankedSurplus';
import { Year } from '@/core/domain/value-objects/Year';
import { prisma } from '@/infrastructure/db/prisma';

export class PrismaBankingRepository implements BankingRepository {
  async save(surplus: BankedSurplus): Promise<void> {
    await prisma.bankEntry.create({
      data: {
        shipId: surplus.shipId,
        year: surplus.year.value,
        amountGco2eq: surplus.amount,
      },
    });
  }

  async findTotalBankedForShip(shipId: string, year: Year): Promise<number> {
    const result = await prisma.bankEntry.aggregate({
      where: {
        shipId,
        year: year.value,
      },
      _sum: {
        amountGco2eq: true,
      },
    });

    return result._sum.amountGco2eq ?? 0;
  }

  async applyBankedAmount(
    shipId: string,
    year: Year,
    amount: number,
  ): Promise<void> {
    await prisma.bankEntry.create({
      data: {
        shipId,
        year: year.value,
        amountGco2eq: -amount,
      },
    });
  }

  async findRecordsByShipAndYear(
    shipId: string,
    year: Year,
  ): Promise<
    {
      id: string;
      shipId: string;
      year: number;
      amountGco2eq: number;
    }[]
  > {
    const records = await prisma.bankEntry.findMany({
      where: {
        shipId,
        ...(year.value > 0 ? { year: year.value } : {}),
      },
    });
    return records;
  }

}

