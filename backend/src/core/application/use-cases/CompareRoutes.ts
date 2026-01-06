import { RouteRepository } from '../../ports/outbound/RouteRepository';
import { Route } from '../../domain/entities/Route';
import { Year } from '../../domain/value-objects/Year';

export interface ComparisonResult {
    route?: Route;
    baseline: Route;
    comparison: {
        percentDiff: number;
        compliant: boolean;
    };
    results?: {
        route: Route;
        percentDiff: number;
        compliant: boolean;
    }[];
}

export class CompareRoutes {
    constructor(private readonly repository: RouteRepository) { }

    async execute(year: Year, routeId?: string): Promise<ComparisonResult> {
        const baseline = await this.repository.findBaseline(year);
        if (!baseline) {
            throw new Error('No baseline set for this year');
        }

        if (routeId) {
            const route = await this.repository.findByRouteIdAndYear(routeId, year);
            if (!route) {
                throw new Error('Route not found');
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
        } else {
            const routes = await this.repository.findByYear(year);
            const comparisons = routes.map(r => {
                const percentDiff =
                    ((r.ghgIntensity.value / baseline.ghgIntensity.value) - 1) * 100;
                const compliant = r.ghgIntensity.value <= baseline.ghgIntensity.value;
                return {
                    route: r,
                    percentDiff,
                    compliant
                };
            });

            return {
                baseline,
                comparison: {
                    percentDiff: 0, // Not applicable for multiple
                    compliant: true
                },
                results: comparisons
            };
        }
    }
}
