import { ComputeComplianceBalance } from '@/core/application/use-cases/ComputeComplianceBalance';
import { Route } from '@/core/domain/entities/Route';
import { Year } from '@/core/domain/value-objects/Year';
import { GHGIntensity } from '@/core/domain/value-objects/GHGIntensity';

describe('ComputeComplianceBalance', () => {
  it('computes compliance balance for route', () => {
    const useCase = new ComputeComplianceBalance(
      new GHGIntensity(89.3368)
    );

    const route = new Route({
      routeId: 'R001',
      vesselType: 'Container',
      fuelType: 'HFO',
      year: new Year(2025),
      ghgIntensity: new GHGIntensity(91),
      fuelConsumption: 1000,
      distance: 10000,
      totalEmissions: 4000
    });

    const cb = useCase.execute(route);

    expect(cb.value).toBeLessThan(0);
  });
});

