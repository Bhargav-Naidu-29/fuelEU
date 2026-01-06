import { RoutesPort } from '@/core/ports';
import { Route } from '@/core/domain';
import { HttpClientPort } from '@/core/ports';

export class RoutesApi implements RoutesPort {
    constructor(private readonly http: HttpClientPort) { }

    async getRoutes(): Promise<Route[]> {
        const data = await this.http.get<any[]>('/routes');
        return data.map(Route.fromApi);
    }

    async setBaseline(
        routeId: string,
        year: number
    ): Promise<void> {
        await this.http.post(
            `/routes/${routeId}/baseline`,
            { year }
        );
    }

    async compareRoutes(
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
    }> {
        const data = await this.http.get<any>('/routes/comparison', {
            year,
            ...(routeId && { routeId }),
        });

        return {
            baseline: Route.fromApi(data.baseline),
            comparison: data.comparison,
            comparisonRoute: data.comparisonRoute ? Route.fromApi(data.comparisonRoute) : undefined,
            results: data.results?.map((r: any) => ({
                route: Route.fromApi(r.route),
                percentDiff: r.percentDiff,
                compliant: r.compliant,
            })),
        };
    }
}
