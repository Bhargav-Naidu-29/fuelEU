import { ComplianceRepository } from '@/core/ports/outbound/ComplianceRepository';
import { ComplianceBalance } from '@/core/domain/entities/ComplianceBalance';
import { Year } from '@/core/domain/value-objects/Year';
import { prisma } from '@/infrastructure/db/prisma';

export class PrismaComplianceRepository implements ComplianceRepository {
  async save(balance: ComplianceBalance): Promise<void> {
    await prisma.shipCompliance.upsert({
      where: {
        shipIdYear: {
          shipId: balance.shipId,
          year: balance.year.value,
        },
      },
      update: {
        cbGco2eq: balance.value,
      },
      create: {
        shipId: balance.shipId,
        year: balance.year.value,
        cbGco2eq: balance.value,
      },
    });
  }

  async findByShipAndYear(
    shipId: string,
    year: Year,
  ): Promise<ComplianceBalance | null> {
    const record = await prisma.shipCompliance.findUnique({
      where: {
        shipIdYear: {
          shipId: shipId,
          year: year.value,
        },
      },
    });

    if (!record) return null;

    return new ComplianceBalance({
      shipId: record.shipId,
      year: new Year(record.year),
      value: record.cbGco2eq,
    });
  }
}
