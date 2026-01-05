import { PoolingRepository } from '@/core/ports/outbound/PoolingRepository';
import { Pool } from '@/core/domain/entities/Pool';
import { PoolMember } from '@/core/domain/entities/PoolMember';
import { Year } from '@/core/domain/value-objects/Year';
import { prisma } from '@/infrastructure/db/prisma';

export class PrismaPoolingRepository implements PoolingRepository {
  async save(pool: Pool): Promise<void> {
    await prisma.$transaction(async tx => {
      const createdPool = await tx.pool.create({
        data: {
          year: pool.year,
        },
      });

      await tx.poolMember.createMany({
        data: pool.members.map(member => ({
          poolId: createdPool.id,
          shipId: member.shipId,
          cbBefore: member.cbBefore,
          cbAfter: member.cbAfter,
        })),
      });
    });
  }

  async findPoolsByYear(year: Year): Promise<Pool[]> {
    const records = await prisma.pool.findMany({
      where: {
        year: year.value,
      },
      include: {
        members: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map(record => {
      const poolMembers = record.members.map(
        member =>
          new PoolMember(member.shipId, member.cbBefore, member.cbAfter),
      );

      return new Pool(record.year, poolMembers);
    });
  }
}
