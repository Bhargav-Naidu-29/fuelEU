import { Route } from '../../domain/entities/Route';
import { EnergyUsed } from '../../domain/value-objects/EnergyUsed';
import { ComplianceValue } from '../../domain/value-objects/ComplianceValue';
import { GHGIntensity } from '../../domain/value-objects/GHGIntensity';
import { ComplianceBalance } from '../../domain/entities/ComplianceBalance';

export class ComputeComplianceBalance {
  private readonly targetIntensity: GHGIntensity;

  constructor(targetIntensity: GHGIntensity) {
    this.targetIntensity = targetIntensity;
  }

  execute(route: Route): ComplianceBalance {
    const energy = new EnergyUsed(route.fuelConsumption);

    const complianceValue = ComplianceValue.calculate({
      target: this.targetIntensity,
      actual: route.ghgIntensity,
      energy
    });

    return new ComplianceBalance({
      shipId: route.routeId,
      year: route.year,
      value: complianceValue.value
    });
  }
}
