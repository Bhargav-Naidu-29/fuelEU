import { CreatePool } from '@/core/application/use-cases/CreatePool';
import { PoolingRepository } from '@/core/ports/outbound/PoolingRepository';
import { Year } from '@/core/domain/value-objects/Year';

describe('CreatePool', () => {
  let mockRepository: PoolingRepository;
  let useCase: CreatePool;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn().mockResolvedValue(undefined),
      findPoolsByYear: jest.fn(),
    };
    useCase = new CreatePool(mockRepository);
  });

  it('creates pool with valid members', async () => {
    const year = new Year(2025);
    const members = [
      { shipId: 'SHIP001', cb: 50 },
      { shipId: 'SHIP002', cb: -30 },
    ];

    const pool = await useCase.execute({ year, members });

    expect(pool.year).toBe(year.value);
    expect(pool.members).toHaveLength(2);
    expect(mockRepository.save).toHaveBeenCalledTimes(1);
  });

  it('rejects pool with negative total', async () => {
    const year = new Year(2025);
    const members = [
      { shipId: 'SHIP001', cb: -50 },
      { shipId: 'SHIP002', cb: -30 },
    ];

    await expect(useCase.execute({ year, members })).rejects.toThrow(
      'Pool sum must be non-negative',
    );
  });

  it('transfers surplus to deficit ships', async () => {
    const year = new Year(2025);
    const members = [
      { shipId: 'SHIP001', cb: 100 },
      { shipId: 'SHIP002', cb: -50 },
    ];

    const pool = await useCase.execute({ year, members });

    const ship001 = pool.members.find(m => m.shipId === 'SHIP001');
    const ship002 = pool.members.find(m => m.shipId === 'SHIP002');

    expect(ship001?.cbBefore).toBe(100);
    expect(ship001?.cbAfter).toBe(50);
    expect(ship002?.cbBefore).toBe(-50);
    expect(ship002?.cbAfter).toBe(0);
  });

  it('handles multiple deficit ships with sufficient surplus', async () => {
    const year = new Year(2025);
    const members = [
      { shipId: 'SHIP001', cb: 100 },
      { shipId: 'SHIP002', cb: -30 },
      { shipId: 'SHIP003', cb: -20 },
    ];

    const pool = await useCase.execute({ year, members });

    const ship001 = pool.members.find(m => m.shipId === 'SHIP001');
    expect(ship001?.cbAfter).toBe(50);
  });

  it('ensures deficit ship does not exit worse', async () => {
    const year = new Year(2025);
    const members = [
      { shipId: 'SURPLUS', cb: 10 },
      { shipId: 'DEFICIT', cb: -50 },
    ];

    const pool = await useCase.execute({ year, members });
    const deficitShip = pool.members.find(m => m.shipId === 'DEFICIT');
    expect(deficitShip!.cbAfter).toBeGreaterThanOrEqual(deficitShip!.cbBefore);
  });

  it('ensures surplus ship does not exit negative', async () => {
    const year = new Year(2025);
    const members = [
      { shipId: 'SURPLUS', cb: 10 },
      { shipId: 'DEFICIT', cb: -5 },
    ];

    const pool = await useCase.execute({ year, members });
    const surplusShip = pool.members.find(m => m.shipId === 'SURPLUS');
    expect(surplusShip!.cbAfter).toBeGreaterThanOrEqual(0);
  });
});

