import { Pool } from '../../domain/entities/Pool';
import { PoolMember } from '../../domain/entities/PoolMember';
import { Year } from '../../domain/value-objects/Year';
import { PoolingRepository } from '../../ports/outbound/PoolingRepository';

export class CreatePool {
  constructor(private readonly repository: PoolingRepository) { }

  async execute(params: {
    year: Year;
    members: { shipId: string; cb: number }[];
  }): Promise<Pool> {
    const { year, members } = params;

    const total = members.reduce((sum, m) => sum + m.cb, 0);
    if (total < 0) {
      throw new Error('Pool sum must be non-negative');
    }

    const membersWithState = members.map(m => ({ ...m, currentCb: m.cb }));
    const sortedSurplus = membersWithState.filter(m => m.cb > 0).sort((a, b) => b.cb - a.cb);
    const deficitShips = membersWithState.filter(m => m.cb < 0);

    let surplusIndex = 0;
    for (const deficitShip of deficitShips) {
      let deficit = -deficitShip.cb;

      while (deficit > 0 && surplusIndex < sortedSurplus.length) {
        const donor = sortedSurplus[surplusIndex];
        const transfer = Math.min(donor.currentCb, deficit);

        donor.currentCb -= transfer;
        deficitShip.currentCb += transfer;
        deficit -= transfer;

        if (donor.currentCb === 0) {
          surplusIndex++;
        }
      }
    }

    const poolMembers = membersWithState.map(
      m => new PoolMember(m.shipId, m.cb, m.currentCb)
    );

    const pool = new Pool(year.value, poolMembers);

    await this.repository.save(pool);

    return pool;
  }
}
