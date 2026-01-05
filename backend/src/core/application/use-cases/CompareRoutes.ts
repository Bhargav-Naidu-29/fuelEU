import { RouteRepository } from '../../ports/outbound/RouteRepository';
import { Route } from '../../domain/entities/Route';
import { Year } from '../../domain/value-objects/Year';

export interface ComparisonResult {
    route: Route;
    baseline: Route;
    comparison: {
        percentDiff: number;
        compliant: boolean;
    };
}

export class CompareRoutes {
    constructor(private readonly repository: RouteRepository) { }

    async execute(routeId: string, year: Year): Promise<ComparisonResult> {
        const route = await this.repository.findByRouteIdAndYear(routeId, year);
        if (!route) {
            throw new Error('Route not found');
        }

        const baseline = await this.repository.findBaseline(year);
        if (!baseline) {
            throw new Error('No baseline set for this year');
        }

        const percentDiff =
            ((route.ghgIntensity.value / baseline.ghgIntensity.value) - 1) * 100;
        const compliant = route.ghgIntensity.value <= baseline.ghgIntensity.value;

        return {
            route,
            baseline,
            comparison: {
                percentDiff,
                compliant,
            },
        };
    }
}
