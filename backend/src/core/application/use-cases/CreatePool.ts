import { Pool } from '../../domain/entities/Pool';
import { PoolMember } from '../../domain/entities/PoolMember';
import { Year } from '../../domain/value-objects/Year';
import { PoolingRepository } from '../../ports/outbound/PoolingRepository';

export class CreatePool {
  constructor(
    private readonly repository: PoolingRepository
  ) {}

  async execute(params: {
    year: Year;
    members: { shipId: string; cb: number }[];
  }): Promise<Pool> {
    const { year, members } = params;

    const total = members.reduce((sum, m) => sum + m.cb, 0);
    if (total < 0) {
      throw new Error('Pool sum must be non-negative');
    }

    const sorted = [...members].sort((a, b) => b.cb - a.cb);

    const poolMembers: PoolMember[] = [];
    let surplusIndex = 0;

    for (const member of sorted) {
      let cbAfter = member.cb;

      if (member.cb < 0) {
        let deficit = -member.cb;

        while (deficit > 0 && surplusIndex < sorted.length) {
          const donor = sorted[surplusIndex];

          if (donor.cb <= 0) {
            surplusIndex++;
            continue;
          }

          const transfer = Math.min(donor.cb, deficit);

          donor.cb -= transfer;
          deficit -= transfer;
          cbAfter += transfer;
        }

        if (cbAfter < member.cb) {
          throw new Error('Deficit ship cannot exit worse');
        }
      }

      if (member.cb > 0 && cbAfter < 0) {
        throw new Error('Surplus ship cannot exit negative');
      }

      poolMembers.push(
        new PoolMember(member.shipId, member.cb, cbAfter)
      );
    }

    const pool = new Pool(year, poolMembers);

    await this.repository.save(pool);

    return pool;
  }
}
