import { ComputeComplianceBalance } from '@/core/application/use-cases/ComputeComplianceBalance';
import { Route } from '@/core/domain/entities/Route';
import { Year } from '@/core/domain/value-objects/Year';
import { GHGIntensity } from '@/core/domain/value-objects/GHGIntensity';
import { ComplianceRepository } from '@/core/ports/outbound/ComplianceRepository';

describe('ComputeComplianceBalance', () => {
  let mockRepository: ComplianceRepository;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn().mockResolvedValue(undefined),
      findByShipAndYear: jest.fn(),
    };
  });

  it('computes compliance balance for route', async () => {
    const useCase = new ComputeComplianceBalance(
      new GHGIntensity(89.3368),
      mockRepository,
    );

    const route = new Route({
      routeId: 'R001',
      vesselType: 'Container',
      fuelType: 'HFO',
      year: new Year(2025),
      ghgIntensity: new GHGIntensity(91),
      fuelConsumption: 1000,
      distance: 10000,
      totalEmissions: 4000,
    });

    const cb = await useCase.execute(route);

    expect(cb.value).toBeLessThan(0);
    expect(mockRepository.save).toHaveBeenCalledTimes(1);
  });
});
