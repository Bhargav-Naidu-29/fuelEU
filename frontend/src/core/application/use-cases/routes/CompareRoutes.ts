import { RoutesPort } from '@/core/ports';
import { Route } from '@/core/domain';

export class CompareRoutes {
    constructor(private readonly routesPort: RoutesPort) { }

    async execute(year: number, routeId?: string): Promise<{
        baseline: Route;
        comparison: {
            percentDiff: number;
            compliant: boolean;
        };
        comparisonRoute?: Route;
        results?: {
            route: Route;
            percentDiff: number;
            compliant: boolean;
        }[];
    }> {
        return await this.routesPort.compareRoutes(year, routeId);
    }
}
