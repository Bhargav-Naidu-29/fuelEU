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
        routeId: string,
        year: number
    ): Promise<{
        baseline: Route;
        comparison: Route;
        percentDiff: number;
        compliant: boolean;
    }> {
        const data = await this.http.get<any>('/routes/comparison', {
            routeId,
            year,
        });

        return {
            baseline: Route.fromApi(data.baseline),
            comparison: Route.fromApi(data.comparison),
            percentDiff: data.percentDiff,
            compliant: data.compliant,
        };
    }
}
