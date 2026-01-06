import { Route } from '@/core/domain';

export interface RoutesPort {
    getRoutes(): Promise<Route[]>;

    setBaseline(
        routeId: string,
        year: number
    ): Promise<void>;

    compareRoutes(
        routeId: string,
        year: number
    ): Promise<{
        baseline: Route;
        comparison: Route;
        percentDiff: number;
        compliant: boolean;
    }>;
}
