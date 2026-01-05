import { RouteRepository } from '@/core/ports/outbound/RouteRepository';
import { ComplianceRepository } from '@/core/ports/outbound/ComplianceRepository';
import { Year } from '@/core/domain/value-objects/Year';
import { EnergyUsed } from '@/core/domain/value-objects/EnergyUsed';
import { ComplianceValue } from '@/core/domain/value-objects/ComplianceValue';
import { GHGIntensity } from '@/core/domain/value-objects/GHGIntensity';
import { ComplianceBalance } from '@/core/domain/entities/ComplianceBalance';

export class ComputeComplianceFromRoutes {
    constructor(
        private readonly target: GHGIntensity,
        private readonly routeRepo: RouteRepository,
        private readonly complianceRepo: ComplianceRepository,
    ) { }

    async execute(shipId: string, year: Year): Promise<ComplianceBalance> {
        const routes = await this.routeRepo.findByShipAndYear(shipId, year);

        if (routes.length === 0) {
            throw new Error('No routes found for ship and year');
        }

        const totalEnergy = routes.reduce(
            (sum, r) => sum + new EnergyUsed(r.fuelConsumption).value,
            0,
        );

        const weightedIntensity =
            routes.reduce(
                (sum, r) =>
                    sum + r.ghgIntensity.value * new EnergyUsed(r.fuelConsumption).value,
                0,
            ) / totalEnergy;

        const complianceValue = ComplianceValue.calculate({
            target: this.target,
            actual: new GHGIntensity(weightedIntensity),
            energy: { value: totalEnergy },
        });

        const balance = new ComplianceBalance({
            shipId,
            year,
            value: complianceValue.value,
        });

        await this.complianceRepo.save(balance);

        return balance;
    }
}
