import { GHGIntensity } from '@/core/domain/value-objects/GHGIntensity';
import { EnergyUsed } from '@/core/domain/value-objects/EnergyUsed';
import { ComplianceValue } from '@/core/domain/value-objects/ComplianceValue';

describe('ComplianceValue', () => {
  it('computes surplus correctly', () => {
    const target = new GHGIntensity(89.3368);
    const actual = new GHGIntensity(88);
    const energy = new EnergyUsed(1000);

    const cv = ComplianceValue.calculate({ target, actual, energy });

    expect(cv.isSurplus()).toBe(true);
  });
});

