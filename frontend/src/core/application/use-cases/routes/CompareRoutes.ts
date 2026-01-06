import { RoutesPort } from '@/core/ports';
import { Route } from '@/core/domain';

export class CompareRoutes {
    constructor(private readonly routesPort: RoutesPort) { }

    async execute(routeId: string, year: number): Promise<{
        baseline: Route;
        comparison: Route;
        percentDiff: number;
        compliant: boolean;
    }> {
        return await this.routesPort.compareRoutes(routeId, year);
    }
}
