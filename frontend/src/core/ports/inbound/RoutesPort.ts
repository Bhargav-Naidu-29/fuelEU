import { Route } from '@/core/domain';

export interface RoutesPort {
    getRoutes(): Promise<Route[]>;

    setBaseline(
        routeId: string,
        year: number
    ): Promise<void>;

    compareRoutes(
        year: number,
        routeId?: string
    ): Promise<{
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
    }>;
}
